// app/actions/trainer/getAllTrainers.action.ts
'use server'

export interface GetAllTrainersParams {
  location?: string
  subject?: string
  minRating?: number
  maxHourlyRate?: number
  page?: number
  limit?: number
  sortBy?: 'name' | 'rating' | 'hourlyRate' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export async function getAllTrainersAction(params?: GetAllTrainersParams) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Construire l'URL avec les paramètres
    const url = new URL(`${baseUrl}/api/trainers`)
    
    if (params?.location) url.searchParams.set('location', params.location)
    if (params?.subject) url.searchParams.set('subject', params.subject)
    if (params?.minRating) url.searchParams.set('minRating', params.minRating.toString())
    if (params?.maxHourlyRate) url.searchParams.set('maxHourlyRate', params.maxHourlyRate.toString())
    if (params?.page) url.searchParams.set('page', params.page.toString())
    if (params?.limit) url.searchParams.set('limit', params.limit.toString())
    if (params?.sortBy) url.searchParams.set('sortBy', params.sortBy)
    if (params?.sortOrder) url.searchParams.set('sortOrder', params.sortOrder)

    const response = await fetch(url.toString(), {
      method: 'GET',
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Failed to fetch trainers", trainers: [], total: 0 }
    }

    return { 
      success: true, 
      trainers: data.data, 
      total: data.total,
      error: null 
    }
    
  } catch (error) {
    console.error("Get all trainers error:", error)
    return { success: false, error: "Something went wrong", trainers: [], total: 0 }
  }
}