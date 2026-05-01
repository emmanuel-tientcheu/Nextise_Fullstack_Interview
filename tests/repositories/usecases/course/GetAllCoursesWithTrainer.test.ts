// tests/usecases/course/GetAllCoursesWithTrainer.test.ts
import { GetAllCoursesUseCase } from '@/app/api/courses/applications/useCases/GetAllCoursesUseCase'
import { InMemoryCourseRepository } from '@/app/api/courses/infrastructure/persistance/ram/InMemoryCourseRepository'
import { InMemoryTrainerRepository } from '@/app/api/trainers/infrastructure/persistance/ram/InMemoryTrainerRepository'
import { describe, it, expect, beforeEach } from 'vitest'


describe('Get All Courses with Trainer Info', () => {
  let courseRepository: InMemoryCourseRepository
  let trainerRepository: InMemoryTrainerRepository
  let getAllCoursesUseCase: GetAllCoursesUseCase

  beforeEach(() => {
    courseRepository = new InMemoryCourseRepository()
    trainerRepository = new InMemoryTrainerRepository()
    getAllCoursesUseCase = new GetAllCoursesUseCase(courseRepository)
  })

  it('should return courses with trainer names when assigned', async () => {
    // 1. Créer des formateurs
    const trainer1 = await trainerRepository.create({
      name: 'Sophie Martin',
      email: 'sophie@example.com',
      location: 'Paris',
      subjects: ['React'],
    })

    const trainer2 = await trainerRepository.create({
      name: 'Thomas Dubois',
      email: 'thomas@example.com',
      location: 'Lyon',
      subjects: ['Node.js'],
    })

    // 2. Créer des cours avec assignation
    await courseRepository.create({
      name: 'React Workshop',
      date: new Date(),
      subjects: ['React'],
      location: 'Paris',
      participants: 10,
      price: 2500,
      trainerPrice: 800,
      assignedTrainerId: trainer1.id,
    })

    await courseRepository.create({
      name: 'Node.js Course',
      date: new Date(),
      subjects: ['Node.js'],
      location: 'Lyon',
      participants: 8,
      price: 2800,
      trainerPrice: 900,
      assignedTrainerId: trainer2.id,
    })

    await courseRepository.create({
      name: 'No Trainer Course',
      date: new Date(),
      subjects: ['Vue'],
      location: 'Marseille',
      participants: 12,
      price: 2200,
      trainerPrice: 700,
    })

    // 3. Récupérer tous les cours
    const { courses, total } = await getAllCoursesUseCase.execute()

    // 4. Vérifier
    expect(total).toBe(3)
    
    // Vérifier que le premier cours a le bon formateur
    const course1 = courses.find(c => c.name === 'React Workshop')
    expect(course1?.assignedTrainerId).toBe(trainer1.id)
    
    // Vérifier que le deuxième cours a le bon formateur
    const course2 = courses.find(c => c.name === 'Node.js Course')
    expect(course2?.assignedTrainerId).toBe(trainer2.id)
    
    // Vérifier que le troisième cours n'a pas de formateur
    const course3 = courses.find(c => c.name === 'No Trainer Course')
    expect(course3?.assignedTrainerId).toBeNull()
  })

  it('should maintain trainer association after multiple retrievals', async () => {
    // 1. Créer un formateur
    const trainer = await trainerRepository.create({
      name: 'Emma Bernard',
      email: 'emma@example.com',
      location: 'Paris',
      subjects: ['Angular'],
    })

    // 2. Créer un cours avec assignation
    const course = await courseRepository.create({
      name: 'Angular Masterclass',
      date: new Date(),
      subjects: ['Angular'],
      location: 'Paris',
      participants: 15,
      price: 3000,
      trainerPrice: 1000,
      assignedTrainerId: trainer.id,
    })

    // 3. Récupérer plusieurs fois pour vérifier que l'association persiste
    const firstRetrieval = await getAllCoursesUseCase.execute()
    const secondRetrieval = await getAllCoursesUseCase.execute()
    const getById = await courseRepository.findById(course.id)

    expect(firstRetrieval.courses[0].assignedTrainerId).toBe(trainer.id)
    expect(secondRetrieval.courses[0].assignedTrainerId).toBe(trainer.id)
    expect(getById?.assignedTrainerId).toBe(trainer.id)
  })
})