// DTO pour la réponse (ce qu'on renvoie au client)
export interface TrainerResponseDTO {
  id: string
  name: string
  email: string
  location: string
  subjects: string[]
  hourlyRate: number | null
  rating: number | null
  experience: string | null
  availability: any
  createdAt: Date
  updatedAt: Date
}