// presentation/controllers/course/CourseController.ts
import { NextRequest, NextResponse } from 'next/server'
import { CreateCourseUseCase } from '../../applications/useCases/CreateCourseUseCase'
import { UpdateCourseUseCase } from '../../applications/useCases/UpdateCourseUseCase'
import { DeleteCourseUseCase } from '../../applications/useCases/DeleteCourseUseCase'
import { CreateCourseDTO } from '@/app/api/courses/infrastructure/next/CreateCourseDTO'
import { GetCourseByIdUseCase } from '../../applications/useCases/GetCourseByIdUseCase'
import { UpdateCourseDTO } from '@/app/api/courses/infrastructure/next/UpdateCourseDTO'
import { GetAllCoursesUseCase } from '../../applications/useCases/GetAllCoursesUseCase'
import { AssignTrainerUseCase } from '../../applications/useCases/AssignTrainerUseCase'
import { UnassignTrainerUseCase } from '../../applications/useCases/UnassignTrainerUseCase'

export class CourseController {
  constructor(
    private createCourseUseCase: CreateCourseUseCase,
    private updateCourseUseCase: UpdateCourseUseCase,
    private deleteCourseUseCase: DeleteCourseUseCase,
    private getCourseByIdUseCase: GetCourseByIdUseCase,
    private getAllCoursesUseCase: GetAllCoursesUseCase,
    private assignTrainerUseCase: AssignTrainerUseCase,
    private unassignTrainerUseCase: UnassignTrainerUseCase,
  ) {}

  // GET /api/courses - Récupérer tous les cours (avec filtres)
  async getAll(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      
      const status = searchParams.get('status') as any || undefined
      const location = searchParams.get('location') || undefined
      const subject = searchParams.get('subject') || undefined
      const assignedTrainerId = searchParams.get('assignedTrainerId') || undefined
      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
      const sortBy = searchParams.get('sortBy') as 'date' | 'name' | 'createdAt' | 'price' || undefined
      const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || undefined
      const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

      const filters = {
        status,
        location,
        subject,
        assignedTrainerId,
        startDate,
        endDate,
        sortBy,
        sortOrder,
      }

      const { courses, total } = await this.getAllCoursesUseCase.execute(filters, page, limit)
      
      return NextResponse.json({
        success: true,
        data: courses,
        total,
        page: page || 1,
        limit: limit || courses.length,
        message: 'Courses retrieved successfully'
      }, { status: 200 })
      
    } catch (error) {
      console.error('GetAll error:', error)
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        statusCode: 500
      }, { status: 500 })
    }
  }

  // GET /api/courses/[id] - Récupérer un cours par ID
  async getById(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'Course ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      const course = await this.getCourseByIdUseCase.execute(id)
      
      if (!course) {
        return NextResponse.json({
          success: false,
          error: 'Course not found',
          statusCode: 404
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        data: course,
        message: 'Course retrieved successfully'
      }, { status: 200 })
      
    } catch (error) {
      console.error('GetById error:', error)
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        statusCode: 500
      }, { status: 500 })
    }
  }

  // POST /api/courses - Créer un cours
  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      // Validations
      if (!body.name) {
        return NextResponse.json({
          success: false,
          error: 'Course name is required',
          statusCode: 400
        }, { status: 400 })
      }

      if (!body.date) {
        return NextResponse.json({
          success: false,
          error: 'Course date is required',
          statusCode: 400
        }, { status: 400 })
      }

      if (!body.subjects || body.subjects.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'At least one subject is required',
          statusCode: 400
        }, { status: 400 })
      }

      if (!body.location) {
        return NextResponse.json({
          success: false,
          error: 'Course location is required',
          statusCode: 400
        }, { status: 400 })
      }

      if (body.participants < 1) {
        return NextResponse.json({
          success: false,
          error: 'Participants must be at least 1',
          statusCode: 400
        }, { status: 400 })
      }

      if (body.price < 0) {
        return NextResponse.json({
          success: false,
          error: 'Price cannot be negative',
          statusCode: 400
        }, { status: 400 })
      }

      if (body.trainerPrice < 0) {
        return NextResponse.json({
          success: false,
          error: 'Trainer price cannot be negative',
          statusCode: 400
        }, { status: 400 })
      }

      const createCourseDTO: CreateCourseDTO = {
        name: body.name,
        date: new Date(body.date),
        subjects: body.subjects,
        location: body.location,
        participants: body.participants,
        notes: body.notes,
        price: body.price,
        trainerPrice: body.trainerPrice,
        assignedTrainerId: body.assignedTrainerId,
        status: body.status || 'DRAFT',
      }

      const course = await this.createCourseUseCase.execute(createCourseDTO)
      
      return NextResponse.json({
        success: true,
        data: course,
        message: 'Course created successfully'
      }, { status: 201 })
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Location conflict') || error.message.includes('Trainer conflict')) {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 409
          }, { status: 409 })
        }
        if (error.message === 'Course date cannot be in the past') {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 400
          }, { status: 400 })
        }
      }
      
      console.error('Create error:', error)
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        statusCode: 500
      }, { status: 500 })
    }
  }

  // PUT /api/courses/[id] - Mettre à jour un cours
  async update(request: NextRequest, id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'Course ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      const body = await request.json()
      
      const updateCourseDTO: UpdateCourseDTO = {
        name: body.name,
        date: body.date ? new Date(body.date) : undefined,
        subjects: body.subjects,
        location: body.location,
        participants: body.participants,
        notes: body.notes,
        price: body.price,
        trainerPrice: body.trainerPrice,
        assignedTrainerId: body.assignedTrainerId,
        status: body.status,
      }

      const course = await this.updateCourseUseCase.execute(id, updateCourseDTO)
      
      return NextResponse.json({
        success: true,
        data: course,
        message: 'Course updated successfully'
      }, { status: 200 })
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Course not found') {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 404
          }, { status: 404 })
        }
        if (error.message.includes('Location conflict') || error.message.includes('Trainer conflict')) {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 409
          }, { status: 409 })
        }
        if (error.message === 'Course date cannot be in the past') {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 400
          }, { status: 400 })
        }
      }
      
      console.error('Update error:', error)
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        statusCode: 500
      }, { status: 500 })
    }
  }

  // DELETE /api/courses/[id] - Supprimer un cours
  async delete(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'Course ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      await this.deleteCourseUseCase.execute(id)
      
      return NextResponse.json({
        success: true,
        message: 'Course deleted successfully',
        statusCode: 200
      }, { status: 200 })
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        return NextResponse.json({
          success: false,
          error: error.message,
          statusCode: 404
        }, { status: 404 })
      }
      
      console.error('Delete error:', error)
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        statusCode: 500
      }, { status: 500 })
    }
  }

  // ============================================
  // ASSIGN & UNASSIGN 
  // ============================================

  // POST /api/courses/[id]/assign - Assigner un formateur à un cours
  async assign(request: NextRequest, courseId: string): Promise<NextResponse> {
    try {
      if (!courseId) {
        return NextResponse.json({
          success: false,
          error: 'Course ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      const body = await request.json()
      const { trainerId } = body

      if (!trainerId) {
        return NextResponse.json({
          success: false,
          error: 'Trainer ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      const course = await this.assignTrainerUseCase.execute(courseId, trainerId)
      
      return NextResponse.json({
        success: true,
        data: course,
        message: 'Trainer assigned to course successfully'
      }, { status: 200 })
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Course not found' || error.message === 'Trainer not found') {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 404
          }, { status: 404 })
        }
        if (error.message.includes('already assigned')) {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 409
          }, { status: 409 })
        }
      }
      
      console.error('Assign error:', error)
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        statusCode: 500
      }, { status: 500 })
    }
  }

  // POST /api/courses/[id]/unassign - Désassigner le formateur d'un cours
  async unassign(request: NextRequest, courseId: string): Promise<NextResponse> {
    try {
      if (!courseId) {
        return NextResponse.json({
          success: false,
          error: 'Course ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      const course = await this.unassignTrainerUseCase.execute(courseId)
      
      return NextResponse.json({
        success: true,
        data: course,
        message: 'Trainer unassigned from course successfully'
      }, { status: 200 })
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        return NextResponse.json({
          success: false,
          error: error.message,
          statusCode: 404
        }, { status: 404 })
      }
      
      console.error('Unassign error:', error)
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        statusCode: 500
      }, { status: 500 })
    }
  }
}