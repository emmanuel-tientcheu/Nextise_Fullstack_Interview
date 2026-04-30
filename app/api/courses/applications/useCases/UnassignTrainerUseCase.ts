import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper"
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO"
import { ICourseRepository } from "../ports/ICourseRepository"


export class UnassignTrainerUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(courseId: string): Promise<CourseResponseDTO> {
    // Vérifier que la formation existe
    const course = await this.courseRepository.findById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }

    // Désassigner le formateur
    const updatedCourse = await this.courseRepository.unassignTrainer(courseId)

    return CourseMapper.toResponseDTO(updatedCourse)
  }
}