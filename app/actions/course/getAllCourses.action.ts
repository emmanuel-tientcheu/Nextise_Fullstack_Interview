// app/actions/course/getAllCourses.action.ts
'use server'

export interface GetAllCoursesParams {
  status?: 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  location?: string
  subject?: string
  assignedTrainerId?: string
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
  sortBy?: 'date' | 'name' | 'createdAt' | 'price'
  sortOrder?: 'asc' | 'desc'
}

export async function getAllCoursesAction(params?: GetAllCoursesParams) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const url = new URL(`${baseUrl}/api/courses`)
    
    if (params?.status) url.searchParams.set('status', params.status)
    if (params?.location) url.searchParams.set('location', params.location)
    if (params?.subject) url.searchParams.set('subject', params.subject)
    if (params?.assignedTrainerId) url.searchParams.set('assignedTrainerId', params.assignedTrainerId)
    if (params?.startDate) url.searchParams.set('startDate', params.startDate.toISOString())
    if (params?.endDate) url.searchParams.set('endDate', params.endDate.toISOString())
    if (params?.page) url.searchParams.set('page', params.page.toString())
    if (params?.limit) url.searchParams.set('limit', params.limit.toString())
    if (params?.sortBy) url.searchParams.set('sortBy', params.sortBy)
    if (params?.sortOrder) url.searchParams.set('sortOrder', params.sortOrder)

    const response = await fetch(url.toString(), { method: 'GET' })
    const data = await response.json()

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Failed to fetch courses", courses: [], total: 0 }
    }

    return { success: true, courses: data.data, total: data.total, error: null }
    
  } catch (error) {
    console.error("Get all courses error:", error)
    return { success: false, error: "Something went wrong", courses: [], total: 0 }
  }
}