// app/actions/trainer/getTrainerByEmail.action.ts
'use server'

export async function getTrainerByEmailAction(email: string) {
  if (!email) {
    return { success: false, error: "Email is required", trainer: null }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/trainers/email/${encodeURIComponent(email)}`, {
      method: 'GET',
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Trainer not found", trainer: null }
    }

    return { success: true, trainer: data.data, error: null }
    
  } catch (error) {
    console.error("Get trainer by email error:", error)
    return { success: false, error: "Something went wrong", trainer: null }
  }
}