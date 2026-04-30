// tests/usecases/trainer/GetTrainerByIdUseCase.test.ts
import { GetTrainerByIdUseCase } from '@/app/api/trainers/application/useCases/GetTrainerByIdUseCase'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { describe, it, expect, beforeEach } from 'vitest'

describe('GetTrainerByIdUseCase', () => {
  let useCase: GetTrainerByIdUseCase
  let repository: InMemoryTrainerRepository

  beforeEach(() => {
    repository = new InMemoryTrainerRepository()
    useCase = new GetTrainerByIdUseCase(repository)
  })

  it('should return trainer when exists', async () => {
    // Arrange
    const created = await repository.create({
      name: 'Find Me',
      email: 'find@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    // Act
    const result = await useCase.execute(created.id)

    // Assert
    expect(result).toBeDefined()
    expect(result?.id).toBe(created.id)
    expect(result?.name).toBe('Find Me')
  })

  it('should return null when trainer not found', async () => {
    const result = await useCase.execute('non-existent-id')
    expect(result).toBeNull()
  })

  it('should throw error when id is empty', async () => {
    await expect(useCase.execute('')).rejects.toThrow('Trainer ID is required')
  })
})