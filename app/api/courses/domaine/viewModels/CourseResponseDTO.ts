// DTO pour la réponse (ce qu'on renvoie au client)
export interface CourseResponseDTO {
  id: string
  name: string
  date: Date
  subjects: string[]
  location: string
  participants: number
  notes: string | null
  price: number
  trainerPrice: number
  status: 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  assignedTrainerId: string | null
  createdAt: Date
  updatedAt: Date
}
