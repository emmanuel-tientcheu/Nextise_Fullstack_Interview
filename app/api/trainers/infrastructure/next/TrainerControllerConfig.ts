import { ITrainerRepository } from "../../application/ports/ITrainerRepository"
import { CreateTrainerUseCase } from "../../application/useCases/CreateTrainerUseCase"
import { DeleteTrainerUseCase } from "../../application/useCases/DeleteTrainerUseCase"
import { GetAllTrainersUseCase } from "../../application/useCases/GetAllTrainersUseCase"
import { GetTrainerByEmailUseCase } from "../../application/useCases/GetTrainerByEmailUseCase"
import { GetTrainerByIdUseCase } from "../../application/useCases/GetTrainerByIdUseCase"
import { UpdateTrainerUseCase } from "../../application/useCases/UpdateTrainerUseCase"
import { getTrainerRepository } from "./TrainerConfiguration"
import { TrainerController } from "./TrainerController"


class TrainerContainer {
  private static instance: TrainerContainer
  private trainerRepository: ITrainerRepository
  private trainerController: TrainerController | null = null

  private constructor() {
    this.trainerRepository = getTrainerRepository()
  }

  static getInstance(): TrainerContainer {
    if (!TrainerContainer.instance) {
      TrainerContainer.instance = new TrainerContainer()
    }
    return TrainerContainer.instance
  }

  // Use Cases
  private getCreateTrainerUseCase(): CreateTrainerUseCase {
    return new CreateTrainerUseCase(this.trainerRepository)
  }

  private getUpdateTrainerUseCase(): UpdateTrainerUseCase {
    return new UpdateTrainerUseCase(this.trainerRepository)
  }

  private getDeleteTrainerUseCase(): DeleteTrainerUseCase {
    return new DeleteTrainerUseCase(this.trainerRepository)
  }

  private getGetTrainerByIdUseCase(): GetTrainerByIdUseCase {
    return new GetTrainerByIdUseCase(this.trainerRepository)
  }

  private getGetTrainerByEmailUseCase(): GetTrainerByEmailUseCase {
    return new GetTrainerByEmailUseCase(this.trainerRepository)
  }

  private getGetAllTrainersUseCase(): GetAllTrainersUseCase {
    return new GetAllTrainersUseCase(this.trainerRepository)
  }

  // Controller Principal
  getTrainerController(): TrainerController {
    if (!this.trainerController) {
      this.trainerController = new TrainerController(
        this.getCreateTrainerUseCase(),
        this.getUpdateTrainerUseCase(),
        this.getDeleteTrainerUseCase(),
        this.getGetTrainerByIdUseCase(),
        this.getGetTrainerByEmailUseCase(),
        this.getGetAllTrainersUseCase()
      )
    }
    return this.trainerController
  }
}

export const trainerContainer = TrainerContainer.getInstance()