import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper"
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO"
import { ICourseRepository } from "../ports/ICourseRepository"


export class FindPastCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(): Promise<CourseResponseDTO[]> {
    const courses = await this.courseRepository.findPast()
    return CourseMapper.toResponseDTOList(courses)
  }
}