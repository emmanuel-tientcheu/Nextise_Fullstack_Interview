// presentation/controllers/user/UserController.ts
import { NextRequest, NextResponse } from 'next/server'

import { CreateUserUseCase } from '../../application/useCases/CreateUserUseCase'
import { UpdateUserUseCase } from '../../application/useCases/UpdateUserUseCase'
import { DeleteUserUseCase } from '../../application/useCases/DeleteUserUseCase'
import { UpdateUserDTO } from './UpdateUserDTO'
import { CreateUserDTO } from './CreateUserDTO'
import { GetUserByIdUseCase } from '../../application/useCases/GetUserByIdUseCase'

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
  ) {}


  // GET /api/users?id=123 - Récupérer un utilisateur par ID
  async getById(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'User ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      const user = await this.getUserByIdUseCase.execute(id)
      
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
          statusCode: 404
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        data: user,
        message: 'User retrieved successfully'
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



  // POST /api/users - Créer un utilisateur
  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      // Validations
      if (!body.email || !body.password) {
        return NextResponse.json({
          success: false,
          error: 'Email and password are required',
          statusCode: 400
        }, { status: 400 })
      }

      const createUserDTO: CreateUserDTO = {
        email: body.email,
        password: body.password,
        name: body.name,
      }

      const user = await this.createUserUseCase.execute(createUserDTO)
      
      return NextResponse.json({
        success: true,
        data: user,
        message: 'User created successfully'
      }, { status: 201 })
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Email already exists') {
          return NextResponse.json({
            success: false,
            error: error.message,
            statusCode: 409
          }, { status: 409 })
        }
        if (error.message === 'Invalid email format' || 
            error.message === 'Password must be at least 6 characters') {
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

  // PUT /api/users/123 - Mettre à jour un utilisateur
  async update(request: NextRequest, id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'User ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      const body = await request.json()
      
      const updateUserDTO: UpdateUserDTO = {
        email: body.email,
        password: body.password,
        name: body.name,
      }

      const user = await this.updateUserUseCase.execute(id, updateUserDTO)
      
      return NextResponse.json({
        success: true,
        data: user,
        message: 'User updated successfully'
      }, { status: 200 })
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
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
            error.message === 'Password must be at least 6 characters') {
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

  // DELETE /api/users/123 - Supprimer un utilisateur
  async delete(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'User ID is required',
          statusCode: 400
        }, { status: 400 })
      }

      await this.deleteUserUseCase.execute(id)
      
      return NextResponse.json({
        success: true,
        message: 'User deleted successfully',
        statusCode: 200
      }, { status: 200 })
      
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
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