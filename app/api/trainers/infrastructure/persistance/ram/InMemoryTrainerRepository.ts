import { ITrainerRepository } from "@/app/api/trainers/application/ports/ITrainerRepository"

import { randomUUID } from 'crypto'
import { Trainer } from "../../../domaine/models/Trainer"
import { CreateTrainerDTO } from "../../next/CreateTrainerDTO"
import { TrainerFiltersDTO } from "../../next/TrainerFiltersDTO"
import { UpdateTrainerDTO } from "../../next/UpdateTrainerDTO"

export class InMemoryTrainerRepository implements ITrainerRepository {
  private trainers: Map<string, Trainer> = new Map()

  async create(data: CreateTrainerDTO): Promise<Trainer> {
    const now = new Date()
    
    const trainer = new Trainer(
      randomUUID(),
      data.name,
      data.email,
      data.location,
      data.subjects,
      data.hourlyRate ?? null,
      data.rating ?? null,
      data.experience ?? null,
      data.availability ?? null,
      now,
      now
    )

    this.trainers.set(trainer.id, trainer)
    return trainer
  }

  async findById(id: string): Promise<Trainer | null> {
    return this.trainers.get(id) || null
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    for (const trainer of this.trainers.values()) {
      if (trainer.email === email) {
        return trainer
      }
    }
    return null
  }

  async findAll(
    filters?: TrainerFiltersDTO,
    page?: number,
    limit?: number
  ): Promise<{ trainers: Trainer[]; total: number }> {
    let trainers = Array.from(this.trainers.values())

    // Appliquer les filtres
    if (filters) {
      if (filters.location) {
        trainers = trainers.filter(t => t.location === filters.location)
      }
      if (filters.subject) {
        trainers = trainers.filter(t => t.subjects.includes(filters.subject!))
      }
      if (filters.minRating !== undefined) {
        trainers = trainers.filter(t => (t.rating || 0) >= filters.minRating!)
      }
      if (filters.maxHourlyRate !== undefined) {
        trainers = trainers.filter(t => (t.hourlyRate || 0) <= filters.maxHourlyRate!)
      }
    }

    const total = trainers.length

    // Appliquer la pagination
    if (page !== undefined && limit !== undefined) {
      const start = (page - 1) * limit
      trainers = trainers.slice(start, start + limit)
    }

    return { trainers, total }
  }

  async update(id: string, data: UpdateTrainerDTO): Promise<Trainer> {
    const existingTrainer = await this.findById(id)
    if (!existingTrainer) {
      throw new Error(`Trainer with id ${id} not found`)
    }

    const updatedTrainer = new Trainer(
      existingTrainer.id,
      data.name ?? existingTrainer.name,
      data.email ?? existingTrainer.email,
      data.location ?? existingTrainer.location,
      data.subjects ?? existingTrainer.subjects,
      data.hourlyRate !== undefined ? data.hourlyRate : existingTrainer.hourlyRate,
      data.rating !== undefined ? data.rating : existingTrainer.rating,
      data.experience !== undefined ? data.experience : existingTrainer.experience,
      data.availability !== undefined ? data.availability : existingTrainer.availability,
      existingTrainer.createdAt,
      new Date()
    )

    this.trainers.set(id, updatedTrainer)
    return updatedTrainer
  }

  async delete(id: string): Promise<void> {
    this.trainers.delete(id)
  }

  // Méthode utilitaire pour les tests
  clear(): void {
    this.trainers.clear()
  }

  // Méthode utilitaire pour pré-remplir des données
  seed(trainers: Trainer[]): void {
    for (const trainer of trainers) {
      this.trainers.set(trainer.id, trainer)
    }
  }

  // Récupérer tous les formateurs (utilitaire)
  getAll(): Trainer[] {
    return Array.from(this.trainers.values())
  }
}