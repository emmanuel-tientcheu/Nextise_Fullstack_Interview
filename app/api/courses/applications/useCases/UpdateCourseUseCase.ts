// application/usecases/course/UpdateCourseUseCase.ts
import { CourseMapper } from "../../infrastructure/persistance/prisma/CourseMapper"
import { CourseResponseDTO } from "../../domaine/viewModels/CourseResponseDTO"
import { ICourseRepository } from "../ports/ICourseRepository"
import { UpdateCourseDTO } from "../../infrastructure/next/UpdateCourseDTO"

export class UpdateCourseUseCase {
  constructor(private courseRepository: ICourseRepository) { }

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
    const newDate = data.date || existingCourse.date
    const newStatus = data.status || existingCourse.status

    if (newDate < new Date() && newStatus !== 'DRAFT') {
      throw new Error('Course date cannot be in the past')
    }

    // Vérification des conflits de lieu (si la location ou la date change)
    const locationChanged = data.location !== undefined && data.location !== existingCourse.location
    const dateChanged = data.date !== undefined && data.date !== existingCourse.date

    if (locationChanged || dateChanged) {
      const finalLocation = data.location || existingCourse.location
      const finalDate = data.date || existingCourse.date

      const locationConflicts = await this.courseRepository.findLocationConflicts(
        finalLocation,
        finalDate,
        id // Exclure le cours actuel
      )

      if (locationConflicts.length > 0) {
        const conflictMessages = locationConflicts.map(conflict =>
          `- ${conflict.name} on ${conflict.date.toLocaleDateString()}`
        ).join('\n')

        throw new Error(
          `Location conflict: The location "${finalLocation}" is already booked on ${finalDate.toLocaleDateString()} for the following course(s):\n${conflictMessages}`
        )
      }
    }

    // Vérification des conflits de formateur (si le trainer change ou la date change)
    const trainerChanged = data.assignedTrainerId !== undefined &&
      data.assignedTrainerId !== existingCourse.assignedTrainerId

    if ((trainerChanged || dateChanged) && data.assignedTrainerId) {
      const finalTrainerId = data.assignedTrainerId
      const finalDate = data.date || existingCourse.date

      const trainerConflicts = await this.courseRepository.findTrainerConflicts(
        finalTrainerId,
        finalDate,
        id // Exclure le cours actuel
      )

      if (trainerConflicts.length > 0) {
        const conflictMessages = trainerConflicts.map(conflict =>
          `- ${conflict.name} on ${conflict.date.toLocaleDateString()}`
        ).join('\n')

        throw new Error(
          `Trainer conflict: The trainer is already assigned to another course on ${finalDate.toLocaleDateString()}:\n${conflictMessages}`
        )
      }
    }

    // Mettre à jour la formation
    const updatedCourse = await this.courseRepository.update(id, data)

    return CourseMapper.toResponseDTO(updatedCourse)
  }
}