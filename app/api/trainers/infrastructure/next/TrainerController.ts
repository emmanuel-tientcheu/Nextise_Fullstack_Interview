// presentation/controllers/trainer/TrainerController.ts
import { NextRequest, NextResponse } from 'next/server'
import { CreateTrainerUseCase } from '../../application/useCases/CreateTrainerUseCase'
import { UpdateTrainerUseCase } from '../../application/useCases/UpdateTrainerUseCase'
import { DeleteTrainerUseCase } from '../../application/useCases/DeleteTrainerUseCase'
import { GetTrainerByIdUseCase } from '../../application/useCases/GetTrainerByIdUseCase'
import { GetTrainerByEmailUseCase } from '../../application/useCases/GetTrainerByEmailUseCase'
import { GetAllTrainersUseCase } from '../../application/useCases/GetAllTrainersUseCase'
import { CreateTrainerDTO } from './CreateTrainerDTO'
import { UpdateTrainerDTO } from './UpdateTrainerDTO'


export class TrainerController {
  constructor(
    private createTrainerUseCase: CreateTrainerUseCase,
    private updateTrainerUseCase: UpdateTrainerUseCase,
    private deleteTrainerUseCase: DeleteTrainerUseCase,
    private getTrainerByIdUseCase: GetTrainerByIdUseCase,
    private getTrainerByEmailUseCase: GetTrainerByEmailUseCase,
    private getAllTrainersUseCase: GetAllTrainersUseCase,
  ) {}

  // GET /api/trainers?id=123 - Récupérer un formateur par ID
  async getById(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'Trainer ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      const trainer = await this.getTrainerByIdUseCase.execute(id)
      
      if (!trainer) {
        return NextResponse.json({
          success: false,
          error: 'Trainer not found',
          statusCode: 404
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        data: trainer,
        message: 'Trainer retrieved successfully'
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

  // GET /api/trainers/email/test@test.com - Récupérer par email
  async getByEmail(email: string): Promise<NextResponse> {
    try {
      if (!email) {
        return NextResponse.json({
          success: false,
          error: 'Email is required',
          statusCode: 400
        }, { status: 400 })
      }

      const trainer = await this.getTrainerByEmailUseCase.execute(email)
      
      if (!trainer) {
        return NextResponse.json({
          success: false,
          error: 'Trainer not found',
          statusCode: 404
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        data: trainer,
        message: 'Trainer retrieved successfully'
      }, { status: 200 })
      
    } catch (error) {
      console.error('GetByEmail error:', error)
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        statusCode: 500
      }, { status: 500 })
    }
  }

  // GET /api/trainers - Récupérer tous les formateurs (avec filtres)
  async getAll(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      
      // Extraire les paramètres de filtrage
      const location = searchParams.get('location') || undefined
      const subject = searchParams.get('subject') || undefined
      const minRating = searchParams.get('minRating') 
        ? parseInt(searchParams.get('minRating')!) 
        : undefined
      const maxHourlyRate = searchParams.get('maxHourlyRate')
        ? parseFloat(searchParams.get('maxHourlyRate')!)
        : undefined
      const sortBy = searchParams.get('sortBy') as 'name' | 'rating' | 'hourlyRate' | 'createdAt' || undefined
      const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || undefined
      const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

      const filters = {
        location,
        subject,
        minRating,
        maxHourlyRate,
        sortBy,
        sortOrder,
      }

      const { trainers, total } = await this.getAllTrainersUseCase.execute(filters, page, limit)
      
      return NextResponse.json({
        success: true,
        data: trainers,
        total,
        page: page || 1,
        limit: limit || trainers.length,
        message: 'Trainers retrieved successfully'
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

  // POST /api/trainers - Créer un formateur
  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      // Validations
      if (!body.name) {
        return NextResponse.json({
          success: false,
          error: 'Trainer name is required',
          statusCode: 400
        }, { status: 400 })
      }

      if (!body.email) {
        return NextResponse.json({
          success: false,
          error: 'Trainer email is required',
          statusCode: 400
        }, { status: 400 })
      }

      if (!body.location) {
        return NextResponse.json({
          success: false,
          error: 'Trainer location is required',
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

      const createTrainerDTO: CreateTrainerDTO = {
        name: body.name,
        email: body.email,
        location: body.location,
        subjects: body.subjects,
        hourlyRate: body.hourlyRate,
        rating: body.rating,
        experience: body.experience,
        availability: body.availability,
      }

      const trainer = await this.createTrainerUseCase.execute(createTrainerDTO)
      
      return NextResponse.json({
        success: true,
        data: trainer,
        message: 'Trainer created successfully'
      }, { status: 201 })
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Trainer with this email already exists') {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 409
          }, { status: 409 })
        }
        if (error.message === 'Invalid email format' || 
            error.message === 'Hourly rate cannot be negative' ||
            error.message === 'Rating must be between 1 and 5') {
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

  // PUT /api/trainers/123 - Mettre à jour un formateur
  async update(request: NextRequest, id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'Trainer ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      const body = await request.json()
      
      const updateTrainerDTO: UpdateTrainerDTO = {
        name: body.name,
        email: body.email,
        location: body.location,
        subjects: body.subjects,
        hourlyRate: body.hourlyRate,
        rating: body.rating,
        experience: body.experience,
        availability: body.availability,
      }

      const trainer = await this.updateTrainerUseCase.execute(id, updateTrainerDTO)
      
      return NextResponse.json({
        success: true,
        data: trainer,
        message: 'Trainer updated successfully'
      }, { status: 200 })
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Trainer not found') {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 404
          }, { status: 404 })
        }
        if (error.message === 'Email already exists') {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 409
          }, { status: 409 })
        }
        if (error.message === 'Invalid email format' || 
            error.message === 'Hourly rate cannot be negative' ||
            error.message === 'Rating must be between 1 and 5') {
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

  // DELETE /api/trainers/123 - Supprimer un formateur
  async delete(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'Trainer ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      await this.deleteTrainerUseCase.execute(id)
      
      return NextResponse.json({
        success: true,
        message: 'Trainer deleted successfully',
        statusCode: 200
      }, { status: 200 })
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Trainer not found') {
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
}