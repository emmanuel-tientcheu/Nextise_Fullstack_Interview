import { ITrainerRepository } from "../ports/ITrainerRepository"
import { TrainerResponseDTO } from "../../domaine/viewModels/TrainerResponseDTO"
import { CreateTrainerDTO } from "../../infrastructure/next/CreateTrainerDTO"
import { Trainer } from "../../domaine/models/Trainer"
import { TrainerMapper } from "../../infrastructure/persistance/prisma/TrainerMapper"

export class CreateTrainerUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(data: CreateTrainerDTO): Promise<TrainerResponseDTO> {
    // Validation des données
    if (!data.name || data.name.trim() === '') {
      throw new Error('Trainer name is required')
    }

    if (!data.email || data.email.trim() === '') {
      throw new Error('Trainer email is required')
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format')
    }

    if (!data.location || data.location.trim() === '') {
      throw new Error('Trainer location is required')
    }

    if (!data.subjects || data.subjects.length === 0) {
      throw new Error('At least one subject is required')
    }

    if (data.hourlyRate !== undefined && data.hourlyRate < 0) {
      throw new Error('Hourly rate cannot be negative')
    }

    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5')
    }

    // Vérifier si l'email existe déjà
    const existingTrainer = await this.trainerRepository.findByEmail(data.email)
    if (existingTrainer) {
      throw new Error('Trainer with this email already exists')
    }

    // Créer le formateur
    const trainer = await this.trainerRepository.create(data)

    return TrainerMapper.toResponseDTO(trainer)
  }
}