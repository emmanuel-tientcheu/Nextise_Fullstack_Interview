// app/api/courses/[id]/route.ts
import { NextRequest } from 'next/server'
import { courseContainer } from '../infrastructure/next/CourseControllerConfig'

const courseController = courseContainer.getCourseController()

// GET /api/courses/123 - Récupérer un cours par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return courseController.getById(id)
}

// PUT /api/courses/123 - Mettre à jour un cours
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return courseController.update(request, id)
}

// DELETE /api/courses/123 - Supprimer un cours
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return courseController.delete(id)
}