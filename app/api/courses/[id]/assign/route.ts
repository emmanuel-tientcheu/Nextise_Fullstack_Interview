// app/api/courses/[id]/assign/route.ts
import { NextRequest } from 'next/server'
import { courseContainer } from '../../infrastructure/next/CourseControllerConfig'

const courseController = courseContainer.getCourseController()

// POST /api/courses/123/assign - Assigner un formateur à ce cours
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return courseController.assign(request, id)
}