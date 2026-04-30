import { TrainerSuggestionDTO } from "./TrainerSuggestionDTO"

// DTO pour la réponse de matching AI
export interface AIMatchingResponseDTO {
  suggestions: TrainerSuggestionDTO[]
  message: string
}