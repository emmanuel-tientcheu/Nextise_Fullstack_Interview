// tests/usecases/trainer/DeleteTrainerUseCase.test.ts
import { DeleteTrainerUseCase } from '@/app/api/trainers/application/useCases/DeleteTrainerUseCase'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { describe, it, expect, beforeEach } from 'vitest'

describe('DeleteTrainerUseCase', () => {
  let useCase: DeleteTrainerUseCase
  let repository: InMemoryTrainerRepository

  beforeEach(() => {
    repository = new InMemoryTrainerRepository()
    useCase = new DeleteTrainerUseCase(repository)
  })

  it('should delete an existing trainer', async () => {
    // Arrange
    const created = await repository.create({
      name: 'To Delete',
      email: 'delete@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    // Act
    await useCase.execute(created.id)

    // Assert
    const found = await repository.findById(created.id)
    expect(found).toBeNull()
  })

  it('should throw error when trainer not found', async () => {
    await expect(useCase.execute('non-existent-id'))
      .rejects.toThrow('Trainer not found')
  })
})