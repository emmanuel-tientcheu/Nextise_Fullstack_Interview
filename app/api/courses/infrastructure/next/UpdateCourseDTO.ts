export interface UpdateCourseDTO {
  name?: string
  date?: Date
  subjects?: string[]
  location?: string
  participants?: number
  notes?: string | null
  price?: number
  trainerPrice?: number
  assignedTrainerId?: string | null
  status?: 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
}
