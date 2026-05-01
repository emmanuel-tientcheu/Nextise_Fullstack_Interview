// tests/usecases/course/UpdateCourseUseCase.test.ts
import { UpdateCourseUseCase } from '@/app/api/courses/applications/useCases/UpdateCourseUseCase'
import { InMemoryCourseRepository } from '@/app/api/courses/infrastructure/persistance/ram/InMemoryCourseRepository'
import { describe, it, expect, beforeEach } from 'vitest'


describe('UpdateCourseUseCase', () => {
  let updateCourseUseCase: UpdateCourseUseCase
  let courseRepository: InMemoryCourseRepository

  beforeEach(() => {
    courseRepository = new InMemoryCourseRepository()
    updateCourseUseCase = new UpdateCourseUseCase(courseRepository)
  })

  it('should update a course with valid data', async () => {
    // Create a course first
    const created = await courseRepository.create({
      name: 'Original Name',
      date: new Date('2025-06-15'),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
    })

    const result = await updateCourseUseCase.execute(created.id, {
      name: 'Updated Name',
      participants: 15,
    })

    expect(result.name).toBe('Updated Name')
    expect(result.participants).toBe(15)
    expect(result.location).toBe('Paris')
  })

  it('should throw error when course not found', async () => {
    await expect(updateCourseUseCase.execute('non-existent-id', { name: 'New Name' }))
      .rejects.toThrow('Course not found')
  })

  it('should throw error when updating to conflicting location', async () => {
    // Create first course
    await courseRepository.create({
      name: 'First Course',
      date: new Date('2025-06-15'),
      subjects: ['React'],
      location: 'Paris',
      participants: 5,
      price: 1000,
      trainerPrice: 300,
    })

    // Create second course
    const secondCourse = await courseRepository.create({
      name: 'Second Course',
      date: new Date('2025-06-15'),
      subjects: ['Vue'],
      location: 'Lyon',
      participants: 8,
      price: 1500,
      trainerPrice: 400,
    })

    // Try to update second course to conflicting location
    await expect(updateCourseUseCase.execute(secondCourse.id, { location: 'Paris' }))
      .rejects.toThrow('Location conflict')
  })

  it('should allow update when location conflict is on same course', async () => {
    const course = await courseRepository.create({
      name: 'My Course',
      date: new Date('2025-06-15'),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
    })

    // Updating same course should not conflict with itself
    const result = await updateCourseUseCase.execute(course.id, { location: 'Paris' })
    expect(result.location).toBe('Paris')
  })

  it('should throw error when participants is less than 1', async () => {
    const course = await courseRepository.create({
      name: 'My Course',
      date: new Date('2025-06-15'),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
    })

    await expect(updateCourseUseCase.execute(course.id, { participants: 0 }))
      .rejects.toThrow('Participants must be at least 1')
  })
})