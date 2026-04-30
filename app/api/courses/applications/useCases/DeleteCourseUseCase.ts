import { ICourseRepository } from "../ports/ICourseRepository"

export class DeleteCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(id: string): Promise<void> {
    // Vérifier que la formation existe
    const existingCourse = await this.courseRepository.findById(id)
    if (!existingCourse) {
      throw new Error('Course not found')
    }

    // Supprimer définitivement
    await this.courseRepository.delete(id)
  }
}