import { NextRequest } from 'next/server'
import { container } from '@/lib/ioc/container'

const userController = container.getUserController()

// GET /api/users/123
export async function GET(
  request: NextRequest,
    { params }: { params: Promise<{ id: string }> } 
) {
    const { id } = await params
    console.log('GET request received for user ID:', id)
  return userController.getById(id)
}

// PUT /api/users/123
export async function PUT(
  request: NextRequest,
    { params }: { params: Promise<{ id: string }> } 
) {
    const { id } = await params
  return userController.update(request, id)
}

// DELETE /api/users/123
export async function DELETE(
  request: NextRequest,
    { params }: { params: Promise<{ id: string }> } 
) {
    const { id } = await params
  return userController.delete(id)
}