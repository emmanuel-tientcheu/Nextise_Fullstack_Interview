import { ITrainerRepository } from "../ports/ITrainerRepository"
import { TrainerResponseDTO } from "../../domaine/viewModels/TrainerResponseDTO"
import { TrainerMapper } from "../../infrastructure/persistance/prisma/TrainerMapper"

export class GetTrainerByEmailUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(email: string): Promise<TrainerResponseDTO | null> {
    if (!email || email.trim() === '') {
      throw new Error('Email is required')
    }

    const trainer = await this.trainerRepository.findByEmail(email)

    return trainer ? TrainerMapper.toResponseDTO(trainer) : null
  }
}