// app/api/courses/[id]/unassign/route.ts
import { NextRequest } from 'next/server'
import { courseContainer } from '../../infrastructure/next/CourseControllerConfig'

const courseController = courseContainer.getCourseController()

// POST /api/courses/123/unassign - Désassigner le formateur de ce cours
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return courseController.unassign(request, id)
}