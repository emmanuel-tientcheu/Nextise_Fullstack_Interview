// tests/usecases/course/UnassignTrainerUseCase.test.ts
import { UnassignTrainerUseCase } from '@/app/api/courses/applications/useCases/UnassignTrainerUseCase'
import { InMemoryCourseRepository } from '@/app/api/courses/infrastructure/persistance/ram/InMemoryCourseRepository'
import { describe, it, expect, beforeEach } from 'vitest'


describe('UnassignTrainerUseCase', () => {
  let unassignTrainerUseCase: UnassignTrainerUseCase
  let courseRepository: InMemoryCourseRepository

  beforeEach(() => {
    courseRepository = new InMemoryCourseRepository()
    unassignTrainerUseCase = new UnassignTrainerUseCase(courseRepository)
  })

  it('should unassign a trainer from a course', async () => {
    // Create a course with assigned trainer
    const course = await courseRepository.create({
      name: 'React Workshop',
      date: new Date(),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
      assignedTrainerId: 'trainer-123',
    })

    const result = await unassignTrainerUseCase.execute(course.id)

    expect(result.assignedTrainerId).toBeNull()
  })

  it('should throw error when course not found', async () => {
    await expect(unassignTrainerUseCase.execute('non-existent-id'))
      .rejects.toThrow('Course not found')
  })

  it('should handle course without trainer', async () => {
    // Create a course without trainer
    const course = await courseRepository.create({
      name: 'React Workshop',
      date: new Date(),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
    })

    const result = await unassignTrainerUseCase.execute(course.id)
    expect(result.assignedTrainerId).toBeNull()
  })
})