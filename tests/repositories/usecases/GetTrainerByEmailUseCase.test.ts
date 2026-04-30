// tests/usecases/trainer/GetTrainerByEmailUseCase.test.ts
import { GetTrainerByEmailUseCase } from '@/app/api/trainers/application/useCases/GetTrainerByEmailUseCase'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { describe, it, expect, beforeEach } from 'vitest'

describe('GetTrainerByEmailUseCase', () => {
  let useCase: GetTrainerByEmailUseCase
  let repository: InMemoryTrainerRepository

  beforeEach(() => {
    repository = new InMemoryTrainerRepository()
    useCase = new GetTrainerByEmailUseCase(repository)
  })

  it('should return trainer when email exists', async () => {
    // Arrange
    await repository.create({
      name: 'Email User',
      email: 'email@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    // Act
    const result = await useCase.execute('email@example.com')

    // Assert
    expect(result).toBeDefined()
    expect(result?.email).toBe('email@example.com')
    expect(result?.name).toBe('Email User')
  })

  it('should return null when email not found', async () => {
    const result = await useCase.execute('nonexistent@example.com')
    expect(result).toBeNull()
  })

  it('should throw error when email is empty', async () => {
    await expect(useCase.execute('')).rejects.toThrow('Email is required')
  })
})