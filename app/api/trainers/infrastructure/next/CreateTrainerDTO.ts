// DTO pour la création d'un formateur
export interface CreateTrainerDTO {
  name: string
  email: string
  location: string
  subjects: string[]
  hourlyRate?: number
  rating?: number
  experience?: string
  availability?: any
  blackoutDates?: any
}










