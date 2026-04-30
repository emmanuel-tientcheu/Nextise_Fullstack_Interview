import { ITrainerRepository } from "../ports/ITrainerRepository"
import { TrainerResponseDTO } from "../../domaine/viewModels/TrainerResponseDTO"
import { TrainerMapper } from "../../infrastructure/persistance/prisma/TrainerMapper"
import { TrainerFiltersDTO } from "../../infrastructure/next/TrainerFiltersDTO"

export class GetAllTrainersUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(
    filters?: TrainerFiltersDTO,
    page?: number,
    limit?: number
  ): Promise<{ trainers: TrainerResponseDTO[]; total: number }> {
    const { trainers, total } = await this.trainerRepository.findAll(filters, page, limit)

    return {
      trainers: TrainerMapper.toResponseDTOList(trainers),
      total,
    }
  }
}