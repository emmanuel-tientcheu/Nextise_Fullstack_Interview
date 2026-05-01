// app/actions/course/deleteCourse.action.ts
'use server'

import { redirect } from "next/navigation"

export async function deleteCourseAction(formData: FormData) {
  const id = formData.get("id") as string
  const redirectAfter = formData.get("redirectAfter") as string // ← nouveau

  if (!id) return { success: false, error: "Course ID is required" }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/courses/${id}`, { method: 'DELETE' })
    const data = await response.json()

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Delete failed" }
    }

    // Si on veut rediriger (page détail), on redirect
    if (redirectAfter) {
      redirect(redirectAfter)
    }

    // Sinon on retourne le succès (tableau)
    return { success: true }

  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error
    return { success: false, error: "Something went wrong." }
  }
}