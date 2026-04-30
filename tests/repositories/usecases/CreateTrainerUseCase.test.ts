import { CreateTrainerUseCase } from '@/app/api/trainers/application/useCases/CreateTrainerUseCase'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { describe, it, expect, beforeEach } from 'vitest'


describe('CreateTrainerUseCase', () => {
  let useCase: CreateTrainerUseCase
  let repository: InMemoryTrainerRepository

  beforeEach(() => {
    repository = new InMemoryTrainerRepository()
    useCase = new CreateTrainerUseCase(repository)
  })

  it('should create a trainer with valid data', async () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Paris',
      subjects: ['React', 'Next.js'],
      hourlyRate: 100,
      rating: 5,
    }

    const result = await useCase.execute(data)

    expect(result.id).toBeDefined()
    expect(result.name).toBe('John Doe')
    expect(result.email).toBe('john@example.com')
  })

  it('should throw error when name is missing', async () => {
    const data = {
      email: 'test@example.com',
      location: 'Paris',
      subjects: ['React'],
    } as any

    await expect(useCase.execute(data)).rejects.toThrow('Trainer name is required')
  })

  it('should throw error when email is invalid', async () => {
    const data = {
      name: 'John Doe',
      email: 'invalid-email',
      location: 'Paris',
      subjects: ['React'],
    }

    await expect(useCase.execute(data)).rejects.toThrow('Invalid email format')
  })

  it('should throw error when email already exists', async () => {
    await repository.create({
      name: 'Existing',
      email: 'existing@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    const data = {
      name: 'New',
      email: 'existing@example.com',
      location: 'Lyon',
      subjects: ['Vue'],
    }

    await expect(useCase.execute(data)).rejects.toThrow(
      'Trainer with this email already exists'
    )
  })

  it('should throw error when rating is out of range', async () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Paris',
      subjects: ['React'],
      rating: 6,
    }

    await expect(useCase.execute(data)).rejects.toThrow('Rating must be between 1 and 5')
  })
})