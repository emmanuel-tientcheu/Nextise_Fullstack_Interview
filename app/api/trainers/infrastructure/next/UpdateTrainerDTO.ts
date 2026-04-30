// DTO pour la mise à jour d'un formateur (tous les champs optionnels)
export interface UpdateTrainerDTO {
  name?: string
  email?: string
  location?: string
  subjects?: string[]
  hourlyRate?: number
  rating?: number
  experience?: string
  availability?: any
  blackoutDates?: any
}