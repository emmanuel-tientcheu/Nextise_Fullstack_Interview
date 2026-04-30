// application/usecases/course/GetCourseStatsUseCase.ts

import { ICourseRepository } from "../ports/ICourseRepository"

export class GetCourseStatsUseCase {
  constructor(private courseRepository: ICourseRepository) { }

  async execute(): Promise<{
    total: number
    draft: number
    scheduled: number
    completed: number
    cancelled: number
    totalRevenue: number
    avgParticipants: number
  }> {
    const stats = await this.courseRepository.getStats()

    return {
      total: stats.total,
      draft: stats.draft,
      scheduled: stats.scheduled,
      completed: stats.completed,
      cancelled: stats.cancelled,
      totalRevenue: stats.totalRevenue,
      avgParticipants: stats.avgParticipants,
    }
  }
}