import { ITrainerRepository } from "../ports/ITrainerRepository"
import { TrainerResponseDTO } from "../../domaine/viewModels/TrainerResponseDTO"
import { TrainerMapper } from "../../infrastructure/persistance/prisma/TrainerMapper"

export class GetTrainerByIdUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(id: string): Promise<TrainerResponseDTO | null> {
    if (!id || id.trim() === '') {
      throw new Error('Trainer ID is required')
    }

    const trainer = await this.trainerRepository.findById(id)

    return trainer ? TrainerMapper.toResponseDTO(trainer) : null
  }
}