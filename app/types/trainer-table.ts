import { TrainerResponseDTO } from "../api/trainers/domaine/viewModels/TrainerResponseDTO"

export interface TrainerTableRow {
  id: string
  name: string
  email: string
  location: string
  subjects: string[]
  hourlyRate: number | null
  rating: number | null
  experience: string | null
}

export function mapTrainerToTableRow(trainer: TrainerResponseDTO): TrainerTableRow {
  return {
    id: trainer.id,
    name: trainer.name,
    email: trainer.email,
    location: trainer.location,
    subjects: trainer.subjects,
    hourlyRate: trainer.hourlyRate,
    rating: trainer.rating,
    experience: trainer.experience,
  }
}