// app/actions/trainer/getTrainerById.action.ts
'use server'

export async function getTrainerByIdAction(id: string) {
  if (!id) {
    return { success: false, error: "Trainer ID is required", trainer: null }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/trainers/${id}`, {
      method: 'GET',
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Trainer not found", trainer: null }
    }

    return { success: true, trainer: data.data, error: null }
    
  } catch (error) {
    console.error("Get trainer by ID error:", error)
    return { success: false, error: "Something went wrong", trainer: null }
  }
}