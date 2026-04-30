export interface TrainerSuggestionDTO {
  trainerId: string
  trainerName: string
  score: number
  confidence: number
  reasoning: string
  hourlyRate: number | null
  location: string
  subjects: string[]
}