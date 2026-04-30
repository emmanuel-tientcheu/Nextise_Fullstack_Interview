// lib/mappers/trainer.mapper.ts
import type { Trainer as PrismaTrainer } from '@/lib/generated/prisma/client'
import { Trainer } from '../../../domaine/models/Trainer'
import { TrainerResponseDTO } from '../../../domaine/viewModels/TrainerResponseDTO'
import { CreateTrainerDTO } from '../../next/CreateTrainerDTO'
import { UpdateTrainerDTO } from '../../next/UpdateTrainerDTO'


export class TrainerMapper {
  /**
   * Convertir un Trainer Prisma → Entité Domain Trainer
   */
  static toDomain(prismaTrainer: PrismaTrainer): Trainer {
    return new Trainer(
      prismaTrainer.id,
      prismaTrainer.name,
      prismaTrainer.email,
      prismaTrainer.location,
      prismaTrainer.subjects,
      prismaTrainer.hourlyRate,
      prismaTrainer.rating,
      prismaTrainer.experience,
      prismaTrainer.availability,
      prismaTrainer.createdAt,
      prismaTrainer.updatedAt
    )
  }

  /**
   * Convertir une liste de Trainers Prisma → liste d'Entités Domain
   */
  static toDomainList(prismaTrainers: PrismaTrainer[]): Trainer[] {
    return prismaTrainers.map(trainer => this.toDomain(trainer))
  }

  /**
   * Convertir une Entité Domain Trainer → DTO de réponse
   */
  static toResponseDTO(trainer: Trainer): TrainerResponseDTO {
    return trainer.toResponse()
  }

  /**
   * Convertir une liste d'Entités Domain → liste de DTOs de réponse
   */
  static toResponseDTOList(trainers: Trainer[]): TrainerResponseDTO[] {
    return trainers.map(trainer => trainer.toResponse())
  }

  /**
   * Convertir un Trainer Prisma → DTO de réponse (direct)
   */
  static fromPrismaToResponseDTO(prismaTrainer: PrismaTrainer): TrainerResponseDTO {
    return {
      id: prismaTrainer.id,
      name: prismaTrainer.name,
      email: prismaTrainer.email,
      location: prismaTrainer.location,
      subjects: prismaTrainer.subjects,
      hourlyRate: prismaTrainer.hourlyRate,
      rating: prismaTrainer.rating,
      experience: prismaTrainer.experience,
      availability: prismaTrainer.availability,
      createdAt: prismaTrainer.createdAt,
      updatedAt: prismaTrainer.updatedAt,
    }
  }

  /**
   * Convertir un DTO de création → données pour Prisma
   */
  static toPrismaCreate(data: CreateTrainerDTO) {
    return {
      name: data.name,
      email: data.email,
      location: data.location,
      subjects: data.subjects,
      hourlyRate: data.hourlyRate,
      rating: data.rating,
      experience: data.experience,
      availability: data.availability,
    }
  }

  /**
   * Convertir un DTO de mise à jour → données pour Prisma
   */
  static toPrismaUpdate(data: UpdateTrainerDTO) {
    const updateData: any = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.location !== undefined) updateData.location = data.location
    if (data.subjects !== undefined) updateData.subjects = data.subjects
    if (data.hourlyRate !== undefined) updateData.hourlyRate = data.hourlyRate
    if (data.rating !== undefined) updateData.rating = data.rating
    if (data.experience !== undefined) updateData.experience = data.experience
    if (data.availability !== undefined) updateData.availability = data.availability
    
    return updateData
  }
}