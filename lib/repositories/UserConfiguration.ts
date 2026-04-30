import { IUserRepository } from "@/app/api/users/application/ports/IUserRepository"
import { PrismaUserRepository } from "@/app/api/users/infrastructure/persistance/prisma/PrismaUserRepository"
import { InMemoryUserRepository } from "@/app/api/users/infrastructure/persistance/ram/InMemoryUserRepository"

const USE_IN_MEMORY = process.env.USE_IN_MEMORY_DB === 'true'

// Singleton - une seule instance du repository
let userRepositoryInstance: IUserRepository | null = null

// Factory - retourne l'instance du bon repository
export function getUserRepository(): IUserRepository {
  
  if (!userRepositoryInstance) {
    
    if (USE_IN_MEMORY) {
      // Mode développement / test sans base de données
      console.log('[REPOSITORY] Using InMemoryUserRepository (no database)')
      userRepositoryInstance = new InMemoryUserRepository()
      
    } else {
      // Mode production avec PostgreSQL
      console.log('[REPOSITORY] Using PrismaUserRepository (PostgreSQL)')
      userRepositoryInstance = new PrismaUserRepository()
    }
    
  }
  
  return userRepositoryInstance
}

// Pour les tests unitaires - permettre de réinitialiser
export function resetUserRepository(): void {
  userRepositoryInstance = null
}

// Pour forcer un type de repository (utile pour les tests)
export function setUserRepository(repository: IUserRepository): void {
  userRepositoryInstance = repository
}
