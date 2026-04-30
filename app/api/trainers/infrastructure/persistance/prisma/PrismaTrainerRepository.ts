import { ITrainerRepository } from "../../../application/ports/ITrainerRepository"
import { CreateTrainerDTO } from "../../next/CreateTrainerDTO"
import { Trainer } from "../../../domaine/models/Trainer"
import { prisma } from "@/lib/prisma"
import { TrainerMapper } from "./TrainerMapper"
import { TrainerFiltersDTO } from "../../next/TrainerFiltersDTO"
import { UpdateTrainerDTO } from "../../next/UpdateTrainerDTO"
export class PrismaTrainerRepository implements ITrainerRepository {
  
  async create(data: CreateTrainerDTO): Promise<Trainer> {
    const prismaTrainer = await prisma.trainer.create({
      data: {
        name: data.name,
        email: data.email,
        location: data.location,
        subjects: data.subjects,
        hourlyRate: data.hourlyRate,
        rating: data.rating,
        experience: data.experience,
        availability: data.availability,
      }
    })

    return TrainerMapper.toDomain(prismaTrainer)
  }

  async findById(id: string): Promise<Trainer | null> {
    const prismaTrainer = await prisma.trainer.findUnique({
      where: { id }
    })

    return prismaTrainer ? TrainerMapper.toDomain(prismaTrainer) : null
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    const prismaTrainer = await prisma.trainer.findUnique({
      where: { email }
    })

    return prismaTrainer ? TrainerMapper.toDomain(prismaTrainer) : null
  }

  async findAll(
    filters?: TrainerFiltersDTO,
    page?: number,
    limit?: number
  ): Promise<{ trainers: Trainer[]; total: number }> {
    // Construire le where dynamique
    const where: any = {}

    if (filters) {
      if (filters.location) {
        where.location = filters.location
      }
      if (filters.subject) {
        where.subjects = { has: filters.subject }
      }
      if (filters.minRating !== undefined) {
        where.rating = { gte: filters.minRating }
      }
      if (filters.maxHourlyRate !== undefined) {
        where.hourlyRate = { lte: filters.maxHourlyRate }
      }
    }

    // Calculer la pagination
    const skip = page && limit ? (page - 1) * limit : undefined
    const take = limit

    // Récupérer le total et les données
    const [prismaTrainers, total] = await Promise.all([
      prisma.trainer.findMany({
        where,
        skip,
        take,
        orderBy: filters?.sortBy ? {
          [filters.sortBy]: filters.sortOrder || 'asc'
        } : { name: 'asc' }
      }),
      prisma.trainer.count({ where })
    ])

    const trainers = prismaTrainers.map(t => TrainerMapper.toDomain(t))

    return { trainers, total }
  }

  async update(id: string, data: UpdateTrainerDTO): Promise<Trainer> {
    const updateData = TrainerMapper.toPrismaUpdate(data)

    const prismaTrainer = await prisma.trainer.update({
      where: { id },
      data: updateData
    })

    return TrainerMapper.toDomain(prismaTrainer)
  }

  async delete(id: string): Promise<void> {
    await prisma.trainer.delete({
      where: { id }
    })
  }
}