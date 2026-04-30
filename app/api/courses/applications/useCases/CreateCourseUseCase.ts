import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper"
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO"
import { CreateCourseDTO } from "../../infrastructure/next/CreateCourseDTO"
import { ICourseRepository } from "../ports/ICourseRepository"

export class CreateCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

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

    // Créer la formation
    const course = await this.courseRepository.create(data)

    return CourseMapper.toResponseDTO(course)
  }
}