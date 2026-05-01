'use server'

export async function createTrainerAction(
  state: { success: boolean; errors: { field: string; message: string }[] | null },
  formData: FormData
): Promise<{ success: boolean; errors: { field: string; message: string }[] | null }> {
  // Extraire les données du formulaire
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const location = formData.get("location") as string
  const subjectsStr = formData.get("subjects") as string
  const hourlyRate = formData.get("hourlyRate") as string
  const rating = formData.get("rating") as string
  const experience = formData.get("experience") as string


  const subjects = subjectsStr ? subjectsStr.split(',').map(s => s.trim()) : []

  // Validation
  const errors: { field: string; message: string }[] = []

  if (!name || name.trim() === '') {
    errors.push({ field: "name", message: "Trainer name is required" })
  }

  if (!email || !email.includes("@")) {
    errors.push({ field: "email", message: "Invalid email address" })
  }

  if (!location || location.trim() === '') {
    errors.push({ field: "location", message: "Location is required" })
  }

  if (subjects.length === 0) {
    errors.push({ field: "subjects", message: "At least one subject is required" })
  }

  if (hourlyRate && parseFloat(hourlyRate) < 0) {
    errors.push({ field: "hourlyRate", message: "Hourly rate cannot be negative" })
  }

  if (rating && (parseInt(rating) < 1 || parseInt(rating) > 5)) {
    errors.push({ field: "rating", message: "Rating must be between 1 and 5" })
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/trainers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        location,
        subjects,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        rating: rating ? parseInt(rating) : undefined,
        experience: experience || undefined,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return {
        success: false,
        errors: [{ field: "general", message: data.error || data.message || "Creation failed" }]
      }
    }

    // Redirection (côté client, tu peux utiliser router.push)
    return { success: true, errors: null }

  } catch (error) {
    console.error("Create trainer error:", error)
    return {
      success: false,
      errors: [{ field: "general", message: "Something went wrong. Please try again." }]
    }
  }
}