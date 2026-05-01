// tests/usecases/course/CreateCourseUseCase.test.ts
import { CreateCourseUseCase } from '@/app/api/courses/applications/useCases/CreateCourseUseCase'
import { InMemoryCourseRepository } from '@/app/api/courses/infrastructure/persistance/ram/InMemoryCourseRepository'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { describe, it, expect, beforeEach } from 'vitest'


describe('CreateCourseUseCase', () => {
    let createCourseUseCase: CreateCourseUseCase
    let courseRepository: InMemoryCourseRepository
    let trainerRepository: InMemoryTrainerRepository

    beforeEach(() => {
        courseRepository = new InMemoryCourseRepository()
        trainerRepository = new InMemoryTrainerRepository()
        createCourseUseCase = new CreateCourseUseCase(courseRepository)
    })

    it('should create a course with valid data', async () => {
        const data = {
            name: 'React Workshop',
            date: new Date(),
            subjects: ['React', 'Next.js'],
            location: 'Paris',
            participants: 10,
            price: 2500,
            trainerPrice: 800,
        }

        const result = await createCourseUseCase.execute(data)

        expect(result.id).toBeDefined()
        expect(result.name).toBe('React Workshop')
        expect(result.location).toBe('Paris')
        expect(result.status).toBe('DRAFT')
    })

    it('should throw error when name is missing', async () => {
        const data = {
            date: new Date(),
            subjects: ['React'],
            location: 'Paris',
            participants: 10,
            price: 2500,
            trainerPrice: 800,
        } as any

        await expect(createCourseUseCase.execute(data)).rejects.toThrow('Course name is required')
    })

    it('should throw error when date is missing', async () => {
        const data = {
            name: 'React Workshop',
            subjects: ['React'],
            location: 'Paris',
            participants: 10,
            price: 2500,
            trainerPrice: 800,
        } as any

        await expect(createCourseUseCase.execute(data)).rejects.toThrow('Course date is required')
    })

    it('should throw error when location is missing', async () => {
        const data = {
            name: 'React Workshop',
            date: new Date(),
            subjects: ['React'],
            participants: 10,
            price: 2500,
            trainerPrice: 800,
        } as any

        await expect(createCourseUseCase.execute(data)).rejects.toThrow('Course location is required')
    })

    it('should throw error when participants is less than 1', async () => {
        const data = {
            name: 'React Workshop',
            date: new Date(),
            subjects: ['React'],
            location: 'Paris',
            participants: 0,
            price: 2500,
            trainerPrice: 800,
        }

        await expect(createCourseUseCase.execute(data)).rejects.toThrow('Participants must be at least 1')
    })

    it('should throw error when location conflict exists', async () => {
        // Create first course
        await courseRepository.create({
            name: 'First Course',
            date: new Date(),
            subjects: ['React'],
            location: 'Paris',
            participants: 5,
            price: 1000,
            trainerPrice: 300,
        })

        const data = {
            name: 'Second Course',
            date: new Date(),
            subjects: ['Vue'],
            location: 'Paris',
            participants: 8,
            price: 1500,
            trainerPrice: 400,
        }

        await expect(createCourseUseCase.execute(data)).rejects.toThrow('Location conflict')
    })

    it('should create course when no location conflict', async () => {
        // Create first course on different date
        await courseRepository.create({
            name: 'First Course',
            date: new Date(),
            subjects: ['React'],
            location: 'Paris',
            participants: 5,
            price: 1000,
            trainerPrice: 300,
        })

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        const data = {
            name: 'Second Course',
            date: tomorrow, // Different date
            subjects: ['Vue'],
            location: 'Paris', // Same location but different date
            participants: 8,
            price: 1500,
            trainerPrice: 400,
        }

        const result = await createCourseUseCase.execute(data)
        expect(result.id).toBeDefined()
    })
})