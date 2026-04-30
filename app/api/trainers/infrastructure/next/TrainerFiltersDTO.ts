// DTO pour les filtres
export interface TrainerFiltersDTO {
  location?: string
  subject?: string
  minRating?: number
  maxHourlyRate?: number
  availableDate?: Date
  page?: number
  limit?: number
  sortBy?: 'name' | 'rating' | 'hourlyRate' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}