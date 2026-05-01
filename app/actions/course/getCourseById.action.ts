// app/actions/course/getCourseById.action.ts
'use server'

export async function getCourseByIdAction(id: string) {
  if (!id) {
    return { success: false, error: "Course ID is required", course: null }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/courses/${id}`, {
      method: 'GET',
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Course not found", course: null }
    }

    return { success: true, course: data.data, error: null }
    
  } catch (error) {
    console.error("Get course by ID error:", error)
    return { success: false, error: "Something went wrong", course: null }
  }
}