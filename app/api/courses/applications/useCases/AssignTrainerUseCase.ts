// application/usecases/course/AssignTrainerUseCase.ts
import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper"
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO"
import { ICourseRepository } from "../ports/ICourseRepository"
import { ITrainerRepository } from "@/app/api/trainers/application/ports/ITrainerRepository"
import { IEmailSender } from "@/services/ports/IEmailSender"
import { AssignmentEmailData, EmailResult } from "@/lib/email/types"
export class AssignTrainerUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private trainerRepository: ITrainerRepository,
    private emailSender: IEmailSender
  ) {}

  async execute(courseId: string, trainerId: string): Promise<CourseResponseDTO> {
    // Vérifier que la formation existe
    const course = await this.courseRepository.findById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }

    // Vérifier que le formateur existe
    const trainer = await this.trainerRepository.findById(trainerId)
    if (!trainer) {
      throw new Error('Trainer not found')
    }

    // Vérifier les conflits de planning
    const conflicts = await this.courseRepository.findTrainerConflicts(trainerId, course.date, courseId)
    if (conflicts.length > 0) {
      throw new Error(`Trainer is already assigned to another course on ${course.date.toLocaleDateString()}`)
    }

    // Assigner le formateur
    const updatedCourse = await this.courseRepository.assignTrainer(courseId, trainerId)

    // ✅ Envoyer un email de notification au formateur
    try {
      const emailData: AssignmentEmailData = {
        course: {
          courseId: updatedCourse.id,
          courseName: updatedCourse.name,
          courseDate: updatedCourse.date,
          courseLocation: updatedCourse.location,
          courseParticipants: updatedCourse.participants,
          courseNotes: updatedCourse.notes,
          coursePrice: updatedCourse.price,
          courseTrainerPrice: updatedCourse.trainerPrice,
        },
        trainer: {
          trainerId: trainer.id,
          trainerName: trainer.name,
          trainerEmail: trainer.email,
        },
        assignmentDate: new Date(),
      }

      const emailResult = await this.emailSender.sendAssignmentEmail(emailData)
      
      if (emailResult.success) {
        console.log(`✅ Assignment email sent to ${trainer.email} for course ${updatedCourse.name}`)
      } else {
        console.warn(`⚠️ Failed to send assignment email: ${emailResult.error}`)
      }
    } catch (emailError) {
      // L'email ne bloque pas l'assignation
      console.error('❌ Error sending assignment email:', emailError)
    }

    return CourseMapper.toResponseDTO(updatedCourse)
  }
}