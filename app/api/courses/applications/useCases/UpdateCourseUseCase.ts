import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper"
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO"
import { ICourseRepository } from "../ports/ICourseRepository"
import { UpdateCourseDTO } from "../../infrastructure/next/UpdateCourseDTO"

export class UpdateCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(id: string, data: UpdateCourseDTO): Promise<CourseResponseDTO> {
    // Vérifier que la formation existe
    const existingCourse = await this.courseRepository.findById(id)
    if (!existingCourse) {
      throw new Error('Course not found')
    }

    // Validation des données si présentes
    if (data.participants !== undefined && data.participants < 1) {
      throw new Error('Participants must be at least 1')
    }

    if (data.price !== undefined && data.price < 0) {
      throw new Error('Price cannot be negative')
    }

    if (data.trainerPrice !== undefined && data.trainerPrice < 0) {
      throw new Error('Trainer price cannot be negative')
    }

    if (data.name !== undefined && data.name.trim() === '') {
      throw new Error('Course name cannot be empty')
    }

    if (data.location !== undefined && data.location.trim() === '') {
      throw new Error('Course location cannot be empty')
    }

    // Vérifier que la date n'est pas dans le passé (sauf pour les brouillons)
    if (data.date && data.date < new Date()) {
      const currentStatus = data.status || existingCourse.status
      if (currentStatus !== 'DRAFT') {
        throw new Error('Course date cannot be in the past')
      }
    }

    // Mettre à jour la formation
    const updatedCourse = await this.courseRepository.update(id, data)

    return CourseMapper.toResponseDTO(updatedCourse)
  }
}