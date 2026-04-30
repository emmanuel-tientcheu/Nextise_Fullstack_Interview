import { TrainerResponseDTO } from "./TrainerResponseDTO"

// DTO pour la liste paginée
export interface PaginatedTrainersResponseDTO {
  data: TrainerResponseDTO[]
  total: number
  page: number
  limit: number
  totalPages: number
}