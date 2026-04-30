// tests/repositories/InMemoryTrainerRepository.test.ts
import { CreateTrainerDTO } from '@/app/api/trainers/infrastructure/next/CreateTrainerDTO'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { describe, it, expect, beforeEach } from 'vitest'


describe('InMemoryTrainerRepository', () => {
  let repository: InMemoryTrainerRepository

  beforeEach(() => {
    repository = new InMemoryTrainerRepository()
  })

  describe('create', () => {
    it('should create a trainer successfully', async () => {
      const data: CreateTrainerDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        location: 'Paris',
        subjects: ['React', 'Next.js'],
        hourlyRate: 100,
        rating: 5,
      }

      const trainer = await repository.create(data)

      expect(trainer.id).toBeDefined()
      expect(trainer.name).toBe('John Doe')
      expect(trainer.email).toBe('john@example.com')
      expect(trainer.location).toBe('Paris')
      expect(trainer.subjects).toEqual(['React', 'Next.js'])
      expect(trainer.hourlyRate).toBe(100)
      expect(trainer.rating).toBe(5)
    })
  })

  describe('findById', () => {
    it('should return trainer when exists', async () => {
      const created = await repository.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        location: 'Lyon',
        subjects: ['TypeScript'],
      })

      const found = await repository.findById(created.id)

      expect(found).toBeDefined()
      expect(found?.id).toBe(created.id)
      expect(found?.name).toBe('Jane Doe')
    })

    it('should return null when trainer does not exist', async () => {
      const found = await repository.findById('non-existent-id')
      expect(found).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('should return trainer when email exists', async () => {
      await repository.create({
        name: 'Test User',
        email: 'test@example.com',
        location: 'Paris',
        subjects: ['React'],
      })

      const found = await repository.findByEmail('test@example.com')

      expect(found).toBeDefined()
      expect(found?.email).toBe('test@example.com')
    })

    it('should return null when email does not exist', async () => {
      const found = await repository.findByEmail('nonexistent@example.com')
      expect(found).toBeNull()
    })
  })

  describe('update', () => {
    it('should update trainer successfully', async () => {
      const created = await repository.create({
        name: 'Original Name',
        email: 'update@example.com',
        location: 'Paris',
        subjects: ['React'],
      })

      const updated = await repository.update(created.id, {
        name: 'Updated Name',
        rating: 4,
      })

      expect(updated.name).toBe('Updated Name')
      expect(updated.rating).toBe(4)
      expect(updated.email).toBe('update@example.com')
    })

    it('should throw error when trainer not found', async () => {
      await expect(repository.update('non-existent', { name: 'New Name' }))
        .rejects.toThrow('Trainer with id non-existent not found')
    })
  })

  describe('delete', () => {
    it('should delete trainer successfully', async () => {
      const created = await repository.create({
        name: 'To Delete',
        email: 'delete@example.com',
        location: 'Paris',
        subjects: ['React'],
      })

      await repository.delete(created.id)
      const found = await repository.findById(created.id)

      expect(found).toBeNull()
    })
  })

  describe('findAll with filters', () => {
    beforeEach(async () => {
      await repository.create({
        name: 'Paris Trainer',
        email: 'paris@example.com',
        location: 'Paris',
        subjects: ['React', 'Vue'],
        rating: 5,
        hourlyRate: 100,
      })

      await repository.create({
        name: 'Lyon Trainer',
        email: 'lyon@example.com',
        location: 'Lyon',
        subjects: ['Node.js', 'NestJS'],
        rating: 3,
        hourlyRate: 80,
      })

      await repository.create({
        name: 'Paris Expert',
        email: 'experts@example.com',
        location: 'Paris',
        subjects: ['React', 'Next.js'],
        rating: 5,
        hourlyRate: 150,
      })
    })

    it('should filter by location', async () => {
      const { trainers, total } = await repository.findAll({ location: 'Paris' })
      expect(total).toBe(2)
      expect(trainers.every(t => t.location === 'Paris')).toBe(true)
    })

    it('should filter by subject', async () => {
      const { trainers, total } = await repository.findAll({ subject: 'React' })
      expect(total).toBe(2)
    })

    it('should filter by minRating', async () => {
      const { trainers, total } = await repository.findAll({ minRating: 4 })
      expect(total).toBe(2)
      expect(trainers.every(t => (t.rating || 0) >= 4)).toBe(true)
    })

    it('should paginate results', async () => {
      const { trainers, total } = await repository.findAll({}, 1, 2)
      expect(trainers.length).toBe(2)
      expect(total).toBe(3)
    })
  })
})