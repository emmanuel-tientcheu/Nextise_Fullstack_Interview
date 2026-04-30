// DTO pour les filtres
export interface CourseFiltersDTO {
  status?: 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  location?: string
  subject?: string
  startDate?: Date
  endDate?: Date
  assignedTrainerId?: string
  page?: number
  limit?: number
  sortBy?: 'date' | 'name' | 'createdAt' | 'price'
  sortOrder?: 'asc' | 'desc'
}