import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper"
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO"
import { ICourseRepository } from "../ports/ICourseRepository"
import { ITrainerRepository } from "@/app/api/trainers/application/ports/ITrainerRepository"


export class AssignTrainerUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private trainerRepository: ITrainerRepository
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

    return CourseMapper.toResponseDTO(updatedCourse)
  }
}