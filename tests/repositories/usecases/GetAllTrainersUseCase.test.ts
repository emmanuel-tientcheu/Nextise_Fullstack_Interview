// tests/usecases/trainer/GetAllTrainersUseCase.test.ts
import { GetAllTrainersUseCase } from '@/app/api/trainers/application/useCases/GetAllTrainersUseCase'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { describe, it, expect, beforeEach } from 'vitest'

describe('GetAllTrainersUseCase', () => {
  let useCase: GetAllTrainersUseCase
  let repository: InMemoryTrainerRepository

  beforeEach(() => {
    repository = new InMemoryTrainerRepository()
    useCase = new GetAllTrainersUseCase(repository)
  })

  it('should return all trainers', async () => {
    // Arrange
    await repository.create({
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
    await repository.create({
      name: 'Trainer Three',
      email: 'three@example.com',
      location: 'Paris',
      subjects: ['Angular'],
    })

    // Act
    const { trainers, total } = await useCase.execute()

    // Assert
    expect(total).toBe(3)
    expect(trainers).toHaveLength(3)
  })

  it('should filter trainers by location', async () => {
    // Arrange
    await repository.create({
      name: 'Paris Trainer',
      email: 'paris@example.com',
      location: 'Paris',
      subjects: ['React'],
    })
    await repository.create({
      name: 'Lyon Trainer',
      email: 'lyon@example.com',
      location: 'Lyon',
      subjects: ['Vue'],
    })

    // Act
    const { trainers, total } = await useCase.execute({ location: 'Paris' })

    // Assert
    expect(total).toBe(1)
    expect(trainers[0].location).toBe('Paris')
  })

  it('should filter trainers by subject', async () => {
    // Arrange
    await repository.create({
      name: 'React Trainer',
      email: 'react@example.com',
      location: 'Paris',
      subjects: ['React', 'Next.js'],
    })
    await repository.create({
      name: 'Vue Trainer',
      email: 'vue@example.com',
      location: 'Lyon',
      subjects: ['Vue', 'Nuxt'],
    })

    // Act
    const { trainers, total } = await useCase.execute({ subject: 'React' })

    // Assert
    expect(total).toBe(1)
    expect(trainers[0].subjects).toContain('React')
  })

  it('should filter trainers by minRating', async () => {
    // Arrange
    await repository.create({
      name: 'High Rated',
      email: 'high@example.com',
      location: 'Paris',
      subjects: ['React'],
      rating: 5,
    })
    await repository.create({
      name: 'Low Rated',
      email: 'low@example.com',
      location: 'Lyon',
      subjects: ['Vue'],
      rating: 2,
    })

    // Act
    const { trainers, total } = await useCase.execute({ minRating: 4 })

    // Assert
    expect(total).toBe(1)
    expect(trainers[0].rating).toBe(5)
  })

  it('should filter trainers by maxHourlyRate', async () => {
    // Arrange
    await repository.create({
      name: 'Expensive',
      email: 'expensive@example.com',
      location: 'Paris',
      subjects: ['React'],
      hourlyRate: 150,
    })
    await repository.create({
      name: 'Cheap',
      email: 'cheap@example.com',
      location: 'Lyon',
      subjects: ['Vue'],
      hourlyRate: 50,
    })

    // Act
    const { trainers, total } = await useCase.execute({ maxHourlyRate: 100 })

    // Assert
    expect(total).toBe(1)
    expect(trainers[0].name).toBe('Cheap')
  })

  it('should paginate results', async () => {
    // Arrange
    for (let i = 1; i <= 10; i++) {
      await repository.create({
        name: `Trainer ${i}`,
        email: `trainer${i}@example.com`,
        location: 'Paris',
        subjects: ['React'],
      })
    }

    // Act
    const { trainers, total } = await useCase.execute({}, 2, 3)

    // Assert
    expect(total).toBe(10)
    expect(trainers).toHaveLength(3)
    expect(trainers[0].name).toBe('Trainer 4')
  })
})