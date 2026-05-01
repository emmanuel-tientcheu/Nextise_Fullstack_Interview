// lib/email/types.ts
export interface CourseEmailData {
  courseId: string
  courseName: string
  courseDate: Date
  courseLocation: string
  courseParticipants: number
  courseNotes: string | null
  coursePrice: number
  courseTrainerPrice: number
}

export interface TrainerEmailData {
  trainerId: string
  trainerName: string
  trainerEmail: string
}

export interface AssignmentEmailData {
  course: CourseEmailData
  trainer: TrainerEmailData
  assignmentDate: Date
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}