// infrastructure/persistance/CourseConfiguration.ts
import { ICourseRepository } from '../../applications/ports/ICourseRepository'
import { PrismaCourseRepository } from '../persistance/prisma/PrismaCourseRepository'
import { InMemoryCourseRepository } from '../persistance/ram/InMemoryCourseRepository'


const USE_IN_MEMORY = process.env.USE_IN_MEMORY_DB === 'true'

let courseRepositoryInstance: ICourseRepository | null = null

export function getCourseRepository(): ICourseRepository {
  if (!courseRepositoryInstance) {
    if (USE_IN_MEMORY) {
      console.log('🔧 Using InMemoryCourseRepository (for testing)')
      courseRepositoryInstance = new InMemoryCourseRepository()
    } else {
      console.log('🐘 Using PrismaCourseRepository (production)')
      courseRepositoryInstance = new PrismaCourseRepository()
    }
  }
  return courseRepositoryInstance
}

export function resetCourseRepository(): void {
  courseRepositoryInstance = null
}