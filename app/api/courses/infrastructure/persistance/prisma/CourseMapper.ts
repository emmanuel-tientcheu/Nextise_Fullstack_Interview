// lib/mappers/course.mapper.ts
import { CourseResponseDTO } from '../../../domaine/viewModels/CourseResponseDTO'
import { UpdateCourseDTO } from '../../next/UpdateCourseDTO'
import { CreateCourseDTO } from '../../next/CreateCourseDTO'
import type { Course as PrismaCourse} from '@/lib/generated/prisma/client'
import { Course } from '../../../domaine/models/Course'


export class CourseMapper {
  /**
   * Convertir un Course Prisma → Entité Domain Course
   */
  static toDomain(prismaCourse: PrismaCourse): Course {
    return new Course(
      prismaCourse.id,
      prismaCourse.name,
      prismaCourse.date,
      prismaCourse.subjects,
      prismaCourse.location,
      prismaCourse.participants,
      prismaCourse.price,
      prismaCourse.trainerPrice,
      prismaCourse.status as 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED',
      prismaCourse.notes,
      prismaCourse.assignedTrainerId,
      prismaCourse.createdAt,
      prismaCourse.updatedAt
    )
  }

  /**
   * Convertir une liste de Courses Prisma → liste d'Entités Domain
   */
  static toDomainList(prismaCourses: PrismaCourse[]): Course[] {
    return prismaCourses.map(course => this.toDomain(course))
  }

  /**
   * Convertir une Entité Domain Course → DTO de réponse
   */
  static toResponseDTO(course: Course): CourseResponseDTO {
    return course.toResponse()
  }

  /**
   * Convertir une liste d'Entités Domain → liste de DTOs de réponse
   */
  static toResponseDTOList(courses: Course[]): CourseResponseDTO[] {
    return courses.map(course => course.toResponse())
  }

  /**
   * Convertir un Course Prisma → DTO de réponse (direct)
   */
  static fromPrismaToResponseDTO(prismaCourse: PrismaCourse): CourseResponseDTO {
    return {
      id: prismaCourse.id,
      name: prismaCourse.name,
      date: prismaCourse.date,
      subjects: prismaCourse.subjects,
      location: prismaCourse.location,
      participants: prismaCourse.participants,
      notes: prismaCourse.notes,
      price: prismaCourse.price,
      trainerPrice: prismaCourse.trainerPrice,
      status: prismaCourse.status as 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED',
      assignedTrainerId: prismaCourse.assignedTrainerId,
      createdAt: prismaCourse.createdAt,
      updatedAt: prismaCourse.updatedAt,
    }
  }

  /**
   * Convertir un DTO de création → données pour Prisma
   */
  static toPrismaCreate(data: CreateCourseDTO) {
    return {
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
  }

  /**
   * Convertir un DTO de mise à jour → données pour Prisma
   * (Seuls les champs présents sont inclus)
   */
  static toPrismaUpdate(data: UpdateCourseDTO) {
    const updateData: any = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.date !== undefined) updateData.date = data.date
    if (data.subjects !== undefined) updateData.subjects = data.subjects
    if (data.location !== undefined) updateData.location = data.location
    if (data.participants !== undefined) updateData.participants = data.participants
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.price !== undefined) updateData.price = data.price
    if (data.trainerPrice !== undefined) updateData.trainerPrice = data.trainerPrice
    if (data.assignedTrainerId !== undefined) updateData.assignedTrainerId = data.assignedTrainerId
    if (data.status !== undefined) updateData.status = data.status
    
    return updateData
  }
}