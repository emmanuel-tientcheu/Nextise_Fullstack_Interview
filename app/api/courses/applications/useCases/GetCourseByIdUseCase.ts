import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper"
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO"
import { ICourseRepository } from "../ports/ICourseRepository"


export class GetCourseByIdUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(id: string): Promise<CourseResponseDTO | null> {
    if (!id || id.trim() === '') {
      throw new Error('Course ID is required')
    }

    const course = await this.courseRepository.findById(id)

    return course ? CourseMapper.toResponseDTO(course) : null
  }
}