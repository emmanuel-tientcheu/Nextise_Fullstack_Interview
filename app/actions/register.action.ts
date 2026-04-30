'use server'

import { redirect } from "next/navigation"

export async function registerAction(formData: FormData) {
    // Extraire les données du formulaire
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validation
    const errors: { field: string; message: string }[] = []

    if (!email || !email.includes("@")) {
        errors.push({ field: "email", message: "Invalid email address" })
    }

    if (!password || password.length < 6) {
        errors.push({ field: "password", message: "Password must be at least 6 characters" })
    }

    if (password !== confirmPassword) {
        errors.push({ field: "confirmPassword", message: "Passwords do not match" })
    }

    if (errors.length > 0) {
        return { success: false, errors }
    }

    try {
        // Appeler l'API pour créer l'utilisateur
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        const response = await fetch(`${baseUrl}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            if (response.status === 409) {
                return {
                    success: false,
                    errors: [{ field: "email", message: "Email already exists" }]
                }
            }
            return {
                success: false,
                errors: [{ field: "general", message: data.error || "Something went wrong" }]
            }
        }

        // Rediriger vers login avec un paramètre de succès
        redirect(`/auth/login?registered=true&email=${encodeURIComponent(email)}`)

    } catch (error) {
        // Si c'est une redirection, la propager
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error
        }

        console.error("Registration error:", error)
        return {
            success: false,
            errors: [{ field: "general", message: "Something went wrong. Please try again." }]
        }
    }
}