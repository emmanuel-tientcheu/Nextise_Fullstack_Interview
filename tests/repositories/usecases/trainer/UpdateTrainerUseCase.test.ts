// tests/usecases/trainer/UpdateTrainerUseCase.test.ts
import { UpdateTrainerUseCase } from '@/app/api/trainers/application/useCases/UpdateTrainerUseCase'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { describe, it, expect, beforeEach } from 'vitest'

describe('UpdateTrainerUseCase', () => {
  let useCase: UpdateTrainerUseCase
  let repository: InMemoryTrainerRepository

  beforeEach(() => {
    repository = new InMemoryTrainerRepository()
    useCase = new UpdateTrainerUseCase(repository)
  })

  it('should update a trainer with valid data', async () => {
    // Arrange
    const created = await repository.create({
      name: 'Original Name',
      email: 'update@example.com',
      location: 'Paris',
      subjects: ['React'],
      hourlyRate: 100,
      rating: 4,
    })

    // Act
    const result = await useCase.execute(created.id, {
      name: 'Updated Name',
      rating: 5,
      hourlyRate: 120,
    })

    // Assert
    expect(result.name).toBe('Updated Name')
    expect(result.rating).toBe(5)
    expect(result.hourlyRate).toBe(120)
    expect(result.email).toBe('update@example.com')
  })

  it('should throw error when trainer not found', async () => {
    await expect(useCase.execute('non-existent-id', { name: 'New Name' }))
      .rejects.toThrow('Trainer not found')
  })

  it('should throw error when name is empty', async () => {
    const created = await repository.create({
      name: 'Valid Name',
      email: 'valid@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    await expect(useCase.execute(created.id, { name: '' }))
      .rejects.toThrow('Trainer name cannot be empty')
  })

  it('should throw error when email is invalid', async () => {
    const created = await repository.create({
      name: 'Valid Name',
      email: 'valid@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    await expect(useCase.execute(created.id, { email: 'invalid-email' }))
      .rejects.toThrow('Invalid email format')
  })

  it('should throw error when email already exists', async () => {
    // Create two trainers
    const trainer1 = await repository.create({
      name: 'Trainer One',
      email: 'one@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    await repository.create({
      name: 'Trainer Two',
      email: 'two@example.com',
      location: 'Lyon',
      subjects: ['Vue'],
    })

    await expect(useCase.execute(trainer1.id, { email: 'two@example.com' }))
      .rejects.toThrow('Email already exists')
  })

  it('should throw error when rating is out of range (too low)', async () => {
    const created = await repository.create({
      name: 'Valid Name',
      email: 'valid@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    await expect(useCase.execute(created.id, { rating: 0 }))
      .rejects.toThrow('Rating must be between 1 and 5')
  })

  it('should throw error when rating is out of range (too high)', async () => {
    const created = await repository.create({
      name: 'Valid Name',
      email: 'valid@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    await expect(useCase.execute(created.id, { rating: 6 }))
      .rejects.toThrow('Rating must be between 1 and 5')
  })

  it('should throw error when hourly rate is negative', async () => {
    const created = await repository.create({
      name: 'Valid Name',
      email: 'valid@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    await expect(useCase.execute(created.id, { hourlyRate: -10 }))
      .rejects.toThrow('Hourly rate cannot be negative')
  })

  it('should throw error when subjects array is empty', async () => {
    const created = await repository.create({
      name: 'Valid Name',
      email: 'valid@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    await expect(useCase.execute(created.id, { subjects: [] }))
      .rejects.toThrow('At least one subject is required')
  })
})