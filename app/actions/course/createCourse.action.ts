// app/actions/course/createCourse.action.ts
'use server'

import { redirect } from "next/navigation"

export async function createCourseAction(
  prevState: { success: boolean; errors: { field: string; message: string }[] | null },
  formData: FormData
): Promise<{ success: boolean; errors: { field: string; message: string }[] | null }> {
  // Extraire les données du formulaire
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

  // Traitement des subjects (string → array)
  const subjects = subjectsStr ? subjectsStr.split(',').map(s => s.trim()) : []

  // Validation
  const errors: { field: string; message: string }[] = []

  if (!name || name.trim() === '') {
    errors.push({ field: "name", message: "Course name is required" })
  }

  if (!dateStr) {
    errors.push({ field: "date", message: "Course date is required" })
  }

  if (subjects.length === 0) {
    errors.push({ field: "subjects", message: "At least one subject is required" })
  }

  if (!location || location.trim() === '') {
    errors.push({ field: "location", message: "Course location is required" })
  }

  const participantsNum = parseInt(participants)
  if (isNaN(participantsNum) || participantsNum < 1) {
    errors.push({ field: "participants", message: "Participants must be at least 1" })
  }

  const priceNum = parseFloat(price)
  if (isNaN(priceNum) || priceNum < 0) {
    errors.push({ field: "price", message: "Price cannot be negative" })
  }

  const trainerPriceNum = parseFloat(trainerPrice)
  if (isNaN(trainerPriceNum) || trainerPriceNum < 0) {
    errors.push({ field: "trainerPrice", message: "Trainer price cannot be negative" })
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        date: new Date(dateStr),
        subjects,
        location,
        participants: participantsNum,
        price: priceNum,
        trainerPrice: trainerPriceNum,
        notes: notes || undefined,
        assignedTrainerId: assignedTrainerId || undefined,
        status: status || 'DRAFT',
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
        errors: [{ field: "general", message: data.error || data.message || "Creation failed" }]
      }
    }

    redirect("/dashboard/courses?success=Course created successfully")

    
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    console.error("Create course error:", error)
    return {
      success: false,
      errors: [{ field: "general", message: "Something went wrong. Please try again." }]
    }
  }
}