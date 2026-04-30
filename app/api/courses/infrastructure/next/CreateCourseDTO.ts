// types/dtos/course.dto.ts

export interface CreateCourseDTO {
  name: string
  date: Date
  subjects: string[]
  location: string
  participants: number
  notes?: string
  price: number
  trainerPrice: number
  assignedTrainerId?: string
  status?: 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
}







