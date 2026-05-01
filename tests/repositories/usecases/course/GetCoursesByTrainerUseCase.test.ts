// tests/usecases/course/GetCoursesByTrainerUseCase.test.ts
import { InMemoryCourseRepository } from '@/app/api/courses/infrastructure/persistance/ram/InMemoryCourseRepository'
import { describe, it, expect, beforeEach } from 'vitest'

describe('GetCoursesByTrainerUseCase', () => {
  let courseRepository: InMemoryCourseRepository

  beforeEach(() => {
    courseRepository = new InMemoryCourseRepository()
  })

  it('should get all courses assigned to a trainer', async () => {
    const trainerId = 'trainer-123'

    // Create courses with same trainer
    await courseRepository.create({
      name: 'React Workshop',
      date: new Date('2025-06-15'),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
      assignedTrainerId: trainerId,
    })

    await courseRepository.create({
      name: 'Vue Workshop',
      date: new Date('2025-07-20'),
      subjects: ['Vue'],
      location: 'Lyon',
      participants: 8,
      price: 2000,
      trainerPrice: 600,
      assignedTrainerId: trainerId,
    })

    // Create a course with different trainer
    await courseRepository.create({
      name: 'Angular Workshop',
      date: new Date('2025-08-10'),
      subjects: ['Angular'],
      location: 'Marseille',
      participants: 12,
      price: 3000,
      trainerPrice: 1000,
      assignedTrainerId: 'other-trainer',
    })

    // Find courses by trainer
    const { courses, total } = await courseRepository.findAll({ assignedTrainerId: trainerId })

    expect(total).toBe(2)
    expect(courses[0].name).toBe('React Workshop')
    expect(courses[1].name).toBe('Vue Workshop')
  })

  it('should return empty list when trainer has no courses', async () => {
    const { courses, total } = await courseRepository.findAll({ assignedTrainerId: 'unassigned-trainer' })

    expect(total).toBe(0)
    expect(courses).toHaveLength(0)
  })
})