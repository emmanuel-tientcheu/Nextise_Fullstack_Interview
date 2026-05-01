import { prisma } from '@/lib/prisma'
import { ICourseRepository } from '../../../applications/ports/ICourseRepository'
import { Course } from '../../../domaine/models/Course'
import { CreateCourseDTO } from '../../next/CreateCourseDTO'
import { CourseMapper } from './CourseMapper'
import { CourseFiltersDTO } from '../../next/CourseFiltersDTO'
import { UpdateCourseDTO } from '../../next/UpdateCourseDTO'

export class PrismaCourseRepository implements ICourseRepository {
  
  async create(data: CreateCourseDTO): Promise<Course> {
    const prismaCourse = await prisma.course.create({
      data: {
        name: data.name,
        date: data.date,
        subjects: data.subjects,
        location: data.location,
        participants: data.participants,
        notes: data.notes,
        price: data.price,
        trainerPrice: data.trainerPrice,
        assignedTrainerId: data.assignedTrainerId,
        status: data.status || 'DRAFT',
      }
    })

    return CourseMapper.toDomain(prismaCourse)
  }

  async findById(id: string): Promise<Course | null> {
    const prismaCourse = await prisma.course.findUnique({
      where: { id },
      include: {
        assignedTrainer: true, 
      }
    })

    return prismaCourse ? CourseMapper.toDomain(prismaCourse) : null
  }

  async findAll(
    filters?: CourseFiltersDTO,
    page?: number,
    limit?: number
  ): Promise<{ courses: Course[]; total: number }> {
    // Construire le where dynamique
    const where: any = {}

    if (filters) {
      if (filters.status) {
        where.status = filters.status
      }
      if (filters.location) {
        where.location = filters.location
      }
      if (filters.subject) {
        where.subjects = { has: filters.subject }
      }
      if (filters.assignedTrainerId) {
        where.assignedTrainerId = filters.assignedTrainerId
      }
      if (filters.startDate || filters.endDate) {
        where.date = {}
        if (filters.startDate) {
          where.date.gte = filters.startDate
        }
        if (filters.endDate) {
          where.date.lte = filters.endDate
        }
      }
    }

    // Calculer la pagination
    const skip = page && limit ? (page - 1) * limit : undefined
    const take = limit

    // Récupérer le total et les données
    const [prismaCourses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take,
        orderBy: filters?.sortBy ? {
          [filters.sortBy]: filters.sortOrder || 'asc'
        } : { date: 'asc' },
        include: {
          assignedTrainer: true,  
        }
      }),
      prisma.course.count({ where })
    ])

    const courses = prismaCourses.map(c => CourseMapper.toDomain(c))

    return { courses, total }
  }

  async update(id: string, data: UpdateCourseDTO): Promise<Course> {
    const updateData = CourseMapper.toPrismaUpdate(data)

    const prismaCourse = await prisma.course.update({
      where: { id },
      data: updateData
    })

    return CourseMapper.toDomain(prismaCourse)
  }

  async delete(id: string): Promise<void> {
    await prisma.course.delete({
      where: { id }
    })
  }

  async findUpcoming(): Promise<Course[]> {
    const prismaCourses = await prisma.course.findMany({
      where: {
        date: { gte: new Date() },
        status: { not: 'CANCELLED' }
      },
      orderBy: { date: 'asc' }
    })

    return prismaCourses.map(c => CourseMapper.toDomain(c))
  }

  async findPast(): Promise<Course[]> {
    const prismaCourses = await prisma.course.findMany({
      where: {
        date: { lt: new Date() }
      },
      orderBy: { date: 'desc' }
    })

    return prismaCourses.map(c => CourseMapper.toDomain(c))
  }

  async findLocationConflicts(
    location: string, 
    date: Date, 
    excludeCourseId?: string
  ): Promise<Course[]> {
    // Détecter les conflits de lieu (même lieu, même jour)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const where: any = {
      location,
      date: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: { not: 'CANCELLED' }
    }

    if (excludeCourseId) {
      where.id = { not: excludeCourseId }
    }

    const prismaCourses = await prisma.course.findMany({ where })

    return prismaCourses.map(c => CourseMapper.toDomain(c))
  }

  async findTrainerConflicts(
    trainerId: string, 
    date: Date, 
    excludeCourseId?: string
  ): Promise<Course[]> {
    // Détecter les conflits de formateur (même formateur, même jour)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const where: any = {
      assignedTrainerId: trainerId,
      date: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: { not: 'CANCELLED' }
    }

    if (excludeCourseId) {
      where.id = { not: excludeCourseId }
    }

    const prismaCourses = await prisma.course.findMany({ where })

    return prismaCourses.map(c => CourseMapper.toDomain(c))
  }

  async assignTrainer(courseId: string, trainerId: string): Promise<Course> {
    const prismaCourse = await prisma.course.update({
      where: { id: courseId },
      data: { assignedTrainerId: trainerId }
    })

    return CourseMapper.toDomain(prismaCourse)
  }

  async unassignTrainer(courseId: string): Promise<Course> {
    const prismaCourse = await prisma.course.update({
      where: { id: courseId },
      data: { assignedTrainerId: null }
    })

    return CourseMapper.toDomain(prismaCourse)
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
    // Récupérer toutes les formations pour calculer les stats
    const courses = await prisma.course.findMany()

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
}