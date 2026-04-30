import { ITrainerRepository } from "../ports/ITrainerRepository"
export class DeleteTrainerUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(id: string): Promise<void> {
    // Vérifier que le formateur existe
    const existingTrainer = await this.trainerRepository.findById(id)
    if (!existingTrainer) {
      throw new Error('Trainer not found')
    }

    // Supprimer définitivement
    await this.trainerRepository.delete(id)
  }
}