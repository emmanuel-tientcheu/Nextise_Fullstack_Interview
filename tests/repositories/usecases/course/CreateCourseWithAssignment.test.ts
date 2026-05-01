// tests/usecases/course/CreateCourseWithAssignment.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { CreateCourseUseCase } from '@/app/api/courses/applications/useCases/CreateCourseUseCase'
import { AssignTrainerUseCase } from '@/app/api/courses/applications/useCases/AssignTrainerUseCase'
import { InMemoryCourseRepository } from '@/app/api/courses/infrastructure/persistance/ram/InMemoryCourseRepository'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { IEmailSender } from '@/services/ports/IEmailSender'
import { MockEmailSender } from '@/services/adapters/MockEmailSender'

describe('CreateCourseWithAssignment', () => {
  let createCourseUseCase: CreateCourseUseCase
  let assignTrainerUseCase: AssignTrainerUseCase
  let courseRepository: InMemoryCourseRepository
  let trainerRepository: InMemoryTrainerRepository
  let emailSender: IEmailSender


  beforeEach(() => {
    courseRepository = new InMemoryCourseRepository()
    trainerRepository = new InMemoryTrainerRepository()
    emailSender = new MockEmailSender()
    createCourseUseCase = new CreateCourseUseCase(courseRepository, trainerRepository, emailSender)
    assignTrainerUseCase = new AssignTrainerUseCase(courseRepository, trainerRepository, emailSender)
  })

  it('should create a course and assign a trainer to it', async () => {
    // Create a trainer first
    const trainer = await trainerRepository.create({
      name: 'Sophie Martin',
      email: 'sophie@example.com',
      location: 'Paris',
      subjects: ['React', 'Next.js'],
      hourlyRate: 120,
      rating: 5,
    })

    // Create course with trainer
    const courseData = {
      name: 'Advanced React Workshop',
      date: new Date(),
      subjects: ['React', 'Next.js', 'TypeScript'],
      location: 'Paris',
      participants: 12,
      price: 3500,
      trainerPrice: 1200,
    }

    const course = await createCourseUseCase.execute(courseData)

    // Assign trainer to the course
    const assignedCourse = await assignTrainerUseCase.execute(course.id, trainer.id)

    expect(assignedCourse.assignedTrainerId).toBe(trainer.id)
    expect(assignedCourse.name).toBe('Advanced React Workshop')
  })

  it('should create a course with direct trainer assignment in creation', async () => {
    // Create a trainer
    const trainer = await trainerRepository.create({
      name: 'Thomas Dubois',
      email: 'thomas@example.com',
      location: 'Lyon',
      subjects: ['Node.js', 'GraphQL'],
      hourlyRate: 100,
      rating: 4,
    })

    // Create course with trainer assigned directly
    const courseData = {
      name: 'Node.js Masterclass',
      date: new Date(),
      subjects: ['Node.js', 'GraphQL', 'MongoDB'],
      location: 'Lyon',
      participants: 8,
      price: 2800,
      trainerPrice: 900,
      assignedTrainerId: trainer.id,
    }

    const course = await createCourseUseCase.execute(courseData)

    expect(course.assignedTrainerId).toBe(trainer.id)
    expect(course.location).toBe('Lyon')
  })

  it('should fail when creating course with trainer conflict', async () => {
    // Create a trainer
    const trainer = await trainerRepository.create({
      name: 'Emma Bernard',
      email: 'emma@example.com',
      location: 'Paris',
      subjects: ['Vue', 'Angular'],
      hourlyRate: 110,
      rating: 4,
    })

    // Create first course with trainer
    await courseRepository.create({
      name: 'Vue Workshop',
      date: new Date(),
      subjects: ['Vue'],
      location: 'Paris',
      participants: 10,
      price: 2000,
      trainerPrice: 700,
      assignedTrainerId: trainer.id,
    })

    // Try to create second course with same trainer on same date
    const courseData = {
      name: 'Angular Workshop',
      date: new Date(),
      subjects: ['Angular'],
      location: 'Lyon',
      participants: 8,
      price: 2200,
      trainerPrice: 750,
      assignedTrainerId: trainer.id,
    }

    await expect(createCourseUseCase.execute(courseData)).rejects.toThrow('Trainer conflict')
  })
})