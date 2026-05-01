// app/actions/course/assignTrainerToCourse.action.ts
'use server'

// import { redirect } from "next/navigation"

export async function assignTrainerToCourseAction(formData: FormData) {
  const courseId = formData.get("courseId") as string
  const trainerId = formData.get("trainerId") as string

  if (!courseId) {
    return {
      success: false,
      error: "Course ID is required"
    }
  }

  if (!trainerId) {
    return {
      success: false,
      error: "Trainer ID is required"
    }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/courses/${courseId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trainerId }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      if (response.status === 409) {
        return {
          success: false,
          error: data.error || "Trainer conflict: already assigned to another course on this date"
        }
      }
      return {
        success: false,
        error: data.error || data.message || "Assignment failed"
      }
    }

    // redirect(`/dashboard/courses/${courseId}?success=Trainer assigned successfully`)
    return { success: true }

    
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    console.error("Assign trainer to course error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again."
    }
  }
}