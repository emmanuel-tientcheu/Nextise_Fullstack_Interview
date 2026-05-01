// tests/usecases/course/AssignTrainerUseCase.test.ts
import { AssignTrainerUseCase } from '@/app/api/courses/applications/useCases/AssignTrainerUseCase'
import { InMemoryCourseRepository } from '@/app/api/courses/infrastructure/persistance/ram/InMemoryCourseRepository'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { MockEmailSender } from '@/services/adapters/MockEmailSender'
import { IEmailSender } from '@/services/ports/IEmailSender'
import { describe, it, expect, beforeEach } from 'vitest'


describe('AssignTrainerUseCase', () => {
  let assignTrainerUseCase: AssignTrainerUseCase
  let courseRepository: InMemoryCourseRepository
  let trainerRepository: InMemoryTrainerRepository
  let emailSender: IEmailSender

  beforeEach(() => {
    courseRepository = new InMemoryCourseRepository()
    trainerRepository = new InMemoryTrainerRepository()
    emailSender = new MockEmailSender()
    assignTrainerUseCase = new AssignTrainerUseCase(courseRepository, trainerRepository, emailSender)
  })

  it('should assign a trainer to a course', async () => {
    // Create a trainer
    const trainer = await trainerRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Paris',
      subjects: ['React', 'Next.js'],
    })

    // Create a course
    const course = await courseRepository.create({
      name: 'React Workshop',
      date: new Date(),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
    })

    const result = await assignTrainerUseCase.execute(course.id, trainer.id)

    expect(result.assignedTrainerId).toBe(trainer.id)
  })

  it('should throw error when course not found', async () => {
    const trainer = await trainerRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    await expect(assignTrainerUseCase.execute('non-existent-id', trainer.id))
      .rejects.toThrow('Course not found')
  })

  it('should throw error when trainer not found', async () => {
    const course = await courseRepository.create({
      name: 'React Workshop',
      date: new Date(),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
    })

    await expect(assignTrainerUseCase.execute(course.id, 'non-existent-trainer'))
      .rejects.toThrow('Trainer not found')
  })

  it('should throw error when trainer has conflict on same date', async () => {
    // Create a trainer
    const trainer = await trainerRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    // Create first course with trainer assigned
    await courseRepository.create({
      name: 'First Course',
      date: new Date(),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
      assignedTrainerId: trainer.id,
    })

    // Create second course on same date
    const secondCourse = await courseRepository.create({
      name: 'Second Course',
      date: new Date(),
      subjects: ['Vue'],
      location: 'Lyon',
      participants: 8,
      price: 1500,
      trainerPrice: 400,
    })

    // Try to assign same trainer to second course on same date
    await expect(assignTrainerUseCase.execute(secondCourse.id, trainer.id))
      .rejects.toThrow('Trainer is already assigned')
  })

  it('should allow assign when trainer available on different date', async () => {
    // Create a trainer
    const trainer = await trainerRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    // Create first course
    await courseRepository.create({
      name: 'First Course',
      date: new Date(),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
      assignedTrainerId: trainer.id,
    })

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    // Create second course
    const secondCourse = await courseRepository.create({
      name: 'Second Course',
      date: new Date(tomorrow),
      subjects: ['Vue'],
      location: 'Lyon',
      participants: 8,
      price: 1500,
      trainerPrice: 400,
    })

    const result = await assignTrainerUseCase.execute(secondCourse.id, trainer.id)
    expect(result.assignedTrainerId).toBe(trainer.id)
  })
})