import { ICourseRepository } from "../ports/ICourseRepository"
import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper"
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO"

export class FindUpcomingCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(): Promise<CourseResponseDTO[]> {
    const courses = await this.courseRepository.findUpcoming()
    return CourseMapper.toResponseDTOList(courses)
  }
}