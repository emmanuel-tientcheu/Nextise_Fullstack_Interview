// app/actions/trainer/deleteTrainer.action.ts
'use server'

import { redirect } from "next/navigation"

export async function deleteTrainerAction(formData: FormData) {
  const id = formData.get("id") as string

  if (!id) {
    return {
      success: false,
      error: "Trainer ID is required"
    }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/trainers/${id}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.message || "Delete failed"
      }
    }

    redirect("/dashboard/trainers?success=Trainer deleted successfully")
    
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    console.error("Delete trainer error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again."
    }
  }
}