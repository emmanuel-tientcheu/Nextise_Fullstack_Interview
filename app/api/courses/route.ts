// app/api/courses/route.ts
import { NextRequest } from 'next/server'
import { courseContainer } from './infrastructure/next/CourseControllerConfig'

const courseController = courseContainer.getCourseController()

// GET /api/courses - Récupérer tous les cours (avec filtres)
export async function GET(request: NextRequest) {
  return courseController.getAll(request)
}

// POST /api/courses - Créer un cours
export async function POST(request: NextRequest) {
  return courseController.create(request)
}