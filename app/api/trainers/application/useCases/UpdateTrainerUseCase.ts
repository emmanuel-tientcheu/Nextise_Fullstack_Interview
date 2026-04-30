import { ITrainerRepository } from "../ports/ITrainerRepository"
import { TrainerMapper } from "../../infrastructure/persistance/prisma/TrainerMapper"
import { TrainerResponseDTO } from "../../domaine/viewModels/TrainerResponseDTO"
import { UpdateTrainerDTO } from "../../infrastructure/next/UpdateTrainerDTO"


export class UpdateTrainerUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(id: string, data: UpdateTrainerDTO): Promise<TrainerResponseDTO> {
    // Vérifier que le formateur existe
    const existingTrainer = await this.trainerRepository.findById(id)
    if (!existingTrainer) {
      throw new Error('Trainer not found')
    }

    // Validation des données si présentes
    if (data.name !== undefined && data.name.trim() === '') {
      throw new Error('Trainer name cannot be empty')
    }

    if (data.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format')
      }
      
      // Vérifier si le nouvel email n'est pas déjà pris
      if (data.email !== existingTrainer.email) {
        const emailExists = await this.trainerRepository.findByEmail(data.email)
        if (emailExists) {
          throw new Error('Email already exists')
        }
      }
    }

    if (data.location !== undefined && data.location.trim() === '') {
      throw new Error('Location cannot be empty')
    }

    if (data.subjects !== undefined && data.subjects.length === 0) {
      throw new Error('At least one subject is required')
    }

    if (data.hourlyRate !== undefined && data.hourlyRate < 0) {
      throw new Error('Hourly rate cannot be negative')
    }

    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5')
    }

    // Mettre à jour le formateur
    const updatedTrainer = await this.trainerRepository.update(id, data)

    return TrainerMapper.toResponseDTO(updatedTrainer)
  }
}