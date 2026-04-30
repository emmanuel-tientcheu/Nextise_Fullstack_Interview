import { CourseFiltersDTO } from "../../infrastructure/next/CourseFiltersDTO";
import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper";
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO";
import { ICourseRepository } from "../ports/ICourseRepository";

export class GetAllCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(
    filters?: CourseFiltersDTO,
    page?: number,
    limit?: number
  ): Promise<{ courses: CourseResponseDTO[]; total: number }> {
    const { courses, total } = await this.courseRepository.findAll(filters, page, limit)

    return {
      courses: CourseMapper.toResponseDTOList(courses),
      total,
    }
  }
}