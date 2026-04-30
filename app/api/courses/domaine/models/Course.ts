import { CourseResponseDTO } from "../viewModels/CourseResponseDTO"

export class Course {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly date: Date,
    public readonly subjects: string[],
    public readonly location: string,
    public readonly participants: number,
    public readonly price: number,
    public readonly trainerPrice: number,
    public readonly status: 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED',
    public readonly notes: string | null,
    public readonly assignedTrainerId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Convertir en DTO de réponse (sans les champs sensibles)
  toResponse(): CourseResponseDTO {
    return {
      id: this.id,
      name: this.name,
      date: this.date,
      subjects: this.subjects,
      location: this.location,
      participants: this.participants,
      price: this.price,
      trainerPrice: this.trainerPrice,
      status: this.status,
      notes: this.notes,
      assignedTrainerId: this.assignedTrainerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  // Vérifier si la formation est terminée
  isCompleted(): boolean {
    return this.status === 'COMPLETED'
  }

  // Vérifier si la formation est annulée
  isCancelled(): boolean {
    return this.status === 'CANCELLED'
  }

  // Vérifier si la formation est planifiée
  isScheduled(): boolean {
    return this.status === 'SCHEDULED'
  }

  // Vérifier si la formation est en brouillon
  isDraft(): boolean {
    return this.status === 'DRAFT'
  }
}