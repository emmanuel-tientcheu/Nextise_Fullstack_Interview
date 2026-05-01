// app/actions/course/updateCourse.action.ts
'use server'

import { redirect } from "next/navigation"

export async function updateCourseAction(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const dateStr = formData.get("date") as string
  const subjectsStr = formData.get("subjects") as string
  const location = formData.get("location") as string
  const participants = formData.get("participants") as string
  const price = formData.get("price") as string
  const trainerPrice = formData.get("trainerPrice") as string
  const notes = formData.get("notes") as string
  const assignedTrainerId = formData.get("assignedTrainerId") as string
  const status = formData.get("status") as string

  if (!id) {
    return {
      success: false,
      errors: [{ field: "general", message: "Course ID is required" }]
    }
  }

  // Traitement des subjects
  const subjects = subjectsStr ? subjectsStr.split(',').map(s => s.trim()) : undefined

  // Validation
  const errors: { field: string; message: string }[] = []

  if (name !== undefined && name.trim() === '') {
    errors.push({ field: "name", message: "Course name cannot be empty" })
  }

  if (location !== undefined && location.trim() === '') {
    errors.push({ field: "location", message: "Location cannot be empty" })
  }

  if (participants) {
    const participantsNum = parseInt(participants)
    if (isNaN(participantsNum) || participantsNum < 1) {
      errors.push({ field: "participants", message: "Participants must be at least 1" })
    }
  }

  if (price) {
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) {
      errors.push({ field: "price", message: "Price cannot be negative" })
    }
  }

  if (trainerPrice) {
    const trainerPriceNum = parseFloat(trainerPrice)
    if (isNaN(trainerPriceNum) || trainerPriceNum < 0) {
      errors.push({ field: "trainerPrice", message: "Trainer price cannot be negative" })
    }
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || undefined,
        date: dateStr ? new Date(dateStr) : undefined,
        subjects,
        location: location || undefined,
        participants: participants ? parseInt(participants) : undefined,
        price: price ? parseFloat(price) : undefined,
        trainerPrice: trainerPrice ? parseFloat(trainerPrice) : undefined,
        notes: notes || undefined,
        assignedTrainerId: assignedTrainerId || undefined,
        status: status || undefined,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      if (response.status === 409) {
        return {
          success: false,
          errors: [{ field: "general", message: data.error || "Conflict detected" }]
        }
      }
      return {
        success: false,
        errors: [{ field: "general", message: data.error || data.message || "Update failed" }]
      }
    }

    redirect("/dashboard/courses?success=Course updated successfully")
    
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    console.error("Update course error:", error)
    return {
      success: false,
      errors: [{ field: "general", message: "Something went wrong. Please try again." }]
    }
  }
}