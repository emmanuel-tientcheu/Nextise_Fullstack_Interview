import { ITrainerRepository } from "../../application/ports/ITrainerRepository"
import { PrismaTrainerRepository } from "../persistance/prisma/PrismaTrainerRepository"
import { InMemoryTrainerRepository } from "../persistance/ram/InMemoryTrainerRepository"


const USE_IN_MEMORY = process.env.USE_IN_MEMORY_DB === 'true'

let trainerRepositoryInstance: ITrainerRepository | null = null

export function getTrainerRepository(): ITrainerRepository {
  if (!trainerRepositoryInstance) {
    if (USE_IN_MEMORY) {
      console.log('🔧 Using InMemoryTrainerRepository (for testing)')
      trainerRepositoryInstance = new InMemoryTrainerRepository()
    } else {
      console.log('🐘 Using PrismaTrainerRepository (production)')
      trainerRepositoryInstance = new PrismaTrainerRepository()
    }
  }
  return trainerRepositoryInstance
}

export function resetTrainerRepository(): void {
  trainerRepositoryInstance = null
}