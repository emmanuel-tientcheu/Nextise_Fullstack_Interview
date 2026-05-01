import { ICourseRepository } from '../../../applications/ports/ICourseRepository'
import { Course } from '../../../domaine/models/Course'
import { CreateCourseDTO } from '../../next/CreateCourseDTO'
import { CourseFiltersDTO } from '../../next/CourseFiltersDTO'
import { UpdateCourseDTO } from '../../next/UpdateCourseDTO'
import { randomUUID } from 'crypto'

export class InMemoryCourseRepository implements ICourseRepository {
  private courses: Map<string, Course> = new Map()

  async create(data: CreateCourseDTO): Promise<Course> {
    const now = new Date()
    
    const course = new Course(
      randomUUID(),
      data.name,
      data.date,
      data.subjects,
      data.location,
      data.participants,
      data.price,
      data.trainerPrice,
      data.status || 'DRAFT',
      data.notes || null,
      data.assignedTrainerId || null,
      now,
      now
    )

    this.courses.set(course.id, course)
    return course
  }

  async findById(id: string): Promise<Course | null> {
    return this.courses.get(id) || null
  }

  async findAll(
    filters?: CourseFiltersDTO,
    page?: number,
    limit?: number
  ): Promise<{ courses: Course[]; total: number }> {
    let courses = Array.from(this.courses.values())

    // Appliquer les filtres
    if (filters) {
      if (filters.status) {
        courses = courses.filter(c => c.status === filters.status)
      }
      if (filters.location) {
        courses = courses.filter(c => c.location === filters.location)
      }
      if (filters.subject) {
        courses = courses.filter(c => c.subjects.includes(filters.subject!))
      }
      if (filters.assignedTrainerId) {
        courses = courses.filter(c => c.assignedTrainerId === filters.assignedTrainerId)
      }
      if (filters.startDate) {
        courses = courses.filter(c => c.date >= filters.startDate!)
      }
      if (filters.endDate) {
        courses = courses.filter(c => c.date <= filters.endDate!)
      }
    }

    const total = courses.length

    // Trier
    if (filters?.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1
      courses.sort((a, b) => {
        const aVal = a[filters.sortBy!]
        const bVal = b[filters.sortBy!]
        if (aVal < bVal) return -1 * sortOrder
        if (aVal > bVal) return 1 * sortOrder
        return 0
      })
    } else {
      courses.sort((a, b) => a.date.getTime() - b.date.getTime())
    }

    // Pagination
    if (page !== undefined && limit !== undefined) {
      const start = (page - 1) * limit
      courses = courses.slice(start, start + limit)
    }

    return { courses, total }
  }

  async update(id: string, data: UpdateCourseDTO): Promise<Course> {
    const existingCourse = await this.findById(id)
    if (!existingCourse) {
      throw new Error(`Course with id ${id} not found`)
    }

    const updatedCourse = new Course(
      existingCourse.id,
      data.name ?? existingCourse.name,
      data.date ?? existingCourse.date,
      data.subjects ?? existingCourse.subjects,
      data.location ?? existingCourse.location,
      data.participants ?? existingCourse.participants,
      data.price ?? existingCourse.price,
      data.trainerPrice ?? existingCourse.trainerPrice,
      data.status ?? existingCourse.status,
      data.notes !== undefined ? data.notes : existingCourse.notes,
      data.assignedTrainerId !== undefined ? data.assignedTrainerId : existingCourse.assignedTrainerId,
      existingCourse.createdAt,
      new Date()
    )

    this.courses.set(id, updatedCourse)
    return updatedCourse
  }

  async delete(id: string): Promise<void> {
    this.courses.delete(id)
  }

  async findUpcoming(): Promise<Course[]> {
    const now = new Date()
    const courses = Array.from(this.courses.values())
      .filter(c => c.date >= now && c.status !== 'CANCELLED')
      .sort((a, b) => a.date.getTime() - b.date.getTime())
    
    return courses
  }

  async findPast(): Promise<Course[]> {
    const now = new Date()
    const courses = Array.from(this.courses.values())
      .filter(c => c.date < now)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
    
    return courses
  }

  async findLocationConflicts(
    location: string,
    date: Date,
    excludeCourseId?: string
  ): Promise<Course[]> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    let conflicts = Array.from(this.courses.values())
      .filter(c => 
        c.location === location &&
        c.date >= startOfDay &&
        c.date <= endOfDay &&
        c.status !== 'CANCELLED'
      )

    if (excludeCourseId) {
      conflicts = conflicts.filter(c => c.id !== excludeCourseId)
    }

    return conflicts
  }

  async findTrainerConflicts(
    trainerId: string,
    date: Date,
    excludeCourseId?: string
  ): Promise<Course[]> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    let conflicts = Array.from(this.courses.values())
      .filter(c => 
        c.assignedTrainerId === trainerId &&
        c.date >= startOfDay &&
        c.date <= endOfDay &&
        c.status !== 'CANCELLED'
      )

    if (excludeCourseId) {
      conflicts = conflicts.filter(c => c.id !== excludeCourseId)
    }

    return conflicts
  }

  async assignTrainer(courseId: string, trainerId: string): Promise<Course> {
    const existingCourse = await this.findById(courseId)
    if (!existingCourse) {
      throw new Error(`Course with id ${courseId} not found`)
    }

    const updatedCourse = new Course(
      existingCourse.id,
      existingCourse.name,
      existingCourse.date,
      existingCourse.subjects,
      existingCourse.location,
      existingCourse.participants,
      existingCourse.price,
      existingCourse.trainerPrice,
      existingCourse.status,
      existingCourse.notes,
      trainerId,
      existingCourse.createdAt,
      new Date()
    )

    this.courses.set(courseId, updatedCourse)
    return updatedCourse
  }

  async unassignTrainer(courseId: string): Promise<Course> {
    const existingCourse = await this.findById(courseId)
    if (!existingCourse) {
      throw new Error(`Course with id ${courseId} not found`)
    }

    const updatedCourse = new Course(
      existingCourse.id,
      existingCourse.name,
      existingCourse.date,
      existingCourse.subjects,
      existingCourse.location,
      existingCourse.participants,
      existingCourse.price,
      existingCourse.trainerPrice,
      existingCourse.status,
      existingCourse.notes,
      null,
      existingCourse.createdAt,
      new Date()
    )

    this.courses.set(courseId, updatedCourse)
    return updatedCourse
  }

  async getStats(): Promise<{
    total: number
    draft: number
    scheduled: number
    completed: number
    cancelled: number
    totalRevenue: number
    avgParticipants: number
  }> {
    const courses = Array.from(this.courses.values())

    const stats = {
      total: courses.length,
      draft: courses.filter(c => c.status === 'DRAFT').length,
      scheduled: courses.filter(c => c.status === 'SCHEDULED').length,
      completed: courses.filter(c => c.status === 'COMPLETED').length,
      cancelled: courses.filter(c => c.status === 'CANCELLED').length,
      totalRevenue: courses.reduce((sum, c) => sum + (c.status === 'COMPLETED' ? c.price : 0), 0),
      avgParticipants: courses.length > 0 
        ? Math.round(courses.reduce((sum, c) => sum + c.participants, 0) / courses.length)
        : 0
    }

    return stats
  }

  // Méthodes utilitaires pour les tests
  clear(): void {
    this.courses.clear()
  }

  seed(courses: Course[]): void {
    for (const course of courses) {
      this.courses.set(course.id, course)
    }
  }

  getAll(): Course[] {
    return Array.from(this.courses.values())
  }
}