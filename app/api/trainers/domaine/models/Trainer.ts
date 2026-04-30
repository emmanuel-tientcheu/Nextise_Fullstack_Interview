import { TrainerResponseDTO } from "../viewModels/TrainerResponseDTO"

export class Trainer {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly location: string,
    public readonly subjects: string[],
    public readonly hourlyRate: number | null,
    public readonly rating: number | null,
    public readonly experience: string | null,
    public readonly availability: any | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Convertir en DTO de réponse
  toResponse(): TrainerResponseDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      location: this.location,
      subjects: this.subjects,
      hourlyRate: this.hourlyRate,
      rating: this.rating,
      experience: this.experience,
      availability: this.availability,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  // Vérifier si le formateur peut enseigner un sujet
  canTeach(subject: string): boolean {
    return this.subjects.includes(subject)
  }


  // Calculer le coût pour une formation
  calculateCost(hours: number): number {
    if (!this.hourlyRate) return 0
    return this.hourlyRate * hours
  }
}