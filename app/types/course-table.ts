import { CourseResponseDTO } from "../api/courses/domaine/viewModels/CourseResponseDTO"


export interface CourseTableRow {
  id: string
  name: string
  date: Date
  subjects: string[]
  location: string
  participants: number
  price: number
  status: 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  assignedTrainerId: string | null
  assignedTrainerName?: string
}

export function mapCourseToTableRow(course: CourseResponseDTO): CourseTableRow {
  return {
    id: course.id,
    name: course.name,
    date: course.date,
    subjects: course.subjects,
    location: course.location,
    participants: course.participants,
    price: course.price,
    status: course.status,
    assignedTrainerId: course.assignedTrainerId,
    assignedTrainerName: course.assignedTrainer?.name,
  }
}