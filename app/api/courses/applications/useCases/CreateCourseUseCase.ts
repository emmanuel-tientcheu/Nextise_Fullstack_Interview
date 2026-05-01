// application/usecases/course/CreateCourseUseCase.ts
import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper"
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO"
import { CreateCourseDTO } from "../../infrastructure/next/CreateCourseDTO"
import { ICourseRepository } from "../ports/ICourseRepository"
import { ITrainerRepository } from "@/app/api/trainers/application/ports/ITrainerRepository"
import { IEmailSender } from "@/services/ports/IEmailSender"
import { AssignmentEmailData, EmailResult } from "@/lib/email/types"

export class CreateCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private trainerRepository: ITrainerRepository,
    private emailSender: IEmailSender
  ) {}

  async execute(data: CreateCourseDTO): Promise<CourseResponseDTO> {
    // Validation des données
    if (!data.name || data.name.trim() === '') {
      throw new Error('Course name is required')
    }

    if (!data.date) {
      throw new Error('Course date is required')
    }

    if (!data.subjects || data.subjects.length === 0) {
      throw new Error('At least one subject is required')
    }

    if (!data.location || data.location.trim() === '') {
      throw new Error('Course location is required')
    }

    if (data.participants < 1) {
      throw new Error('Participants must be at least 1')
    }

    if (data.price < 0) {
      throw new Error('Price cannot be negative')
    }

    if (data.trainerPrice < 0) {
      throw new Error('Trainer price cannot be negative')
    }

    // Vérifier que la date n'est pas dans le passé (sauf pour les brouillons)
    if (data.status !== 'DRAFT' && data.date < new Date()) {
      throw new Error('Course date cannot be in the past')
    }

    // Vérification des conflits de lieu
    const locationConflicts = await this.courseRepository.findLocationConflicts(
      data.location,
      data.date
    )

    if (locationConflicts.length > 0) {
      const conflictMessages = locationConflicts.map(conflict => 
        `- ${conflict.name} on ${conflict.date.toLocaleDateString()}`
      ).join('\n')
      
      throw new Error(
        `Location conflict: The location "${data.location}" is already booked on ${data.date.toLocaleDateString()} for the following course(s):\n${conflictMessages}`
      )
    }

    // Vérification des conflits de formateur si un formateur est assigné
    let assignedTrainer = null
    if (data.assignedTrainerId) {
      const trainerConflicts = await this.courseRepository.findTrainerConflicts(
        data.assignedTrainerId,
        data.date
      )

      if (trainerConflicts.length > 0) {
        const conflictMessages = trainerConflicts.map(conflict => 
          `- ${conflict.name} on ${conflict.date.toLocaleDateString()}`
        ).join('\n')
        
        throw new Error(
          `Trainer conflict: The trainer is already assigned to another course on ${data.date.toLocaleDateString()}:\n${conflictMessages}`
        )
      }

      // Récupérer les informations du formateur pour l'email
      assignedTrainer = await this.trainerRepository.findById(data.assignedTrainerId)
    }

    // Créer la formation
    const course = await this.courseRepository.create(data)

    // Envoyer un email si un formateur est assigné
    if (assignedTrainer && course) {
      try {
        const emailData: AssignmentEmailData = {
          course: {
            courseId: course.id,
            courseName: course.name,
            courseDate: course.date,
            courseLocation: course.location,
            courseParticipants: course.participants,
            courseNotes: course.notes,
            coursePrice: course.price,
            courseTrainerPrice: course.trainerPrice,
          },
          trainer: {
            trainerId: assignedTrainer.id,
            trainerName: assignedTrainer.name,
            trainerEmail: assignedTrainer.email,
          },
          assignmentDate: new Date(),
        }

        const emailResult = await this.emailSender.sendAssignmentEmail(emailData)
        
        if (emailResult.success) {
          console.log(`✅ Assignment email sent to ${assignedTrainer.email}`)
        } else {
          console.warn(`⚠️ Failed to send assignment email: ${emailResult.error}`)
        }
      } catch (emailError) {
        // L'email ne bloque pas la création du cours
        console.error('❌ Error sending assignment email:', emailError)
      }
    }

    return CourseMapper.toResponseDTO(course)
  }
}