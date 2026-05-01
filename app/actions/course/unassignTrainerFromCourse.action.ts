// app/actions/course/unassignTrainerFromCourse.action.ts
'use server'

// import { redirect } from "next/navigation"

export async function unassignTrainerFromCourseAction(formData: FormData) {
  const courseId = formData.get("courseId") as string

  if (!courseId) {
    return {
      success: false,
      error: "Course ID is required"
    }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/courses/${courseId}/unassign`, {
      method: 'POST',
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.message || "Unassignment failed"
      }
    }

    // redirect(`/dashboard/courses/${courseId}?success=Trainer unassigned successfully`)
    return { success: true }
    
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    console.error("Unassign trainer from course error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again."
    }
  }
}