'use client'

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useFormState } from "react-dom"
import { updateTrainerAction } from "@/app/actions/trainer/updateTrainer.action"
import { getTrainerByIdAction } from "@/app/actions/trainer/getTrainerById.action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Loader2 } from "lucide-react"

const initialState = {
  success: false,
  errors: null as { field: string; message: string }[] | null,
}

const experienceLevels = [
  { value: "Junior", label: "Junior" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Senior", label: "Senior" },
  { value: "Expert", label: "Expert" },
]

const commonSubjects = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "GraphQL",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "Tailwind CSS",
  "Vue.js",
  "Angular",
]

interface EditTrainerPageProps {
  params: Promise<{ id: string }>
}

export default function EditTrainerPage({ params }: EditTrainerPageProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(updateTrainerAction, initialState)
  const [isLoading, setIsLoading] = useState(true)
  const [trainerId, setTrainerId] = useState<string>("")
  
  // Données du formulaire
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [subjects, setSubjects] = useState<string[]>([])
  const [hourlyRate, setHourlyRate] = useState("")
  const [rating, setRating] = useState("")
  const [experience, setExperience] = useState("")
  const [inputValue, setInputValue] = useState("")

  // Charger les données du trainer
  useEffect(() => {
    const loadTrainer = async () => {
      const { id } = await params
      setTrainerId(id)
      
      const result = await getTrainerByIdAction(id)
      
      if (result.success && result.trainer) {
        setName(result.trainer.name)
        setEmail(result.trainer.email)
        setLocation(result.trainer.location)
        setSubjects(result.trainer.subjects)
        setHourlyRate(result.trainer.hourlyRate?.toString() || "")
        setRating(result.trainer.rating?.toString() || "")
        setExperience(result.trainer.experience || "")
      } else {
        router.push("/dashboard/trainers?error=Trainer not found")
      }
      
      setIsLoading(false)
    }
    
    loadTrainer()
  }, [params, router])

  // Redirection après succès
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard/trainers?success=Trainer updated successfully")
    }
  }, [state?.success, router])

  const handleAddSubject = (subject: string) => {
    if (subject && !subjects.includes(subject)) {
      setSubjects([...subjects, subject])
      setInputValue("")
    }
  }

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      handleAddSubject(inputValue.trim())
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-8 flex justify-center items-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Trainer</CardTitle>
          <CardDescription>
            Update the trainer's information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* ID caché */}
            <input type="hidden" name="id" value={trainerId} />

            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John Doe"
                className="mt-1.5"
                required
              />
              {state?.errors?.find(e => e.field === "name") && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.find(e => e.field === "name")?.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., john@example.com"
                className="mt-1.5"
                required
              />
              {state?.errors?.find(e => e.field === "email") && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.find(e => e.field === "email")?.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                Location *
              </Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Paris, London, New York"
                className="mt-1.5"
                required
              />
              {state?.errors?.find(e => e.field === "location") && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.find(e => e.field === "location")?.message}
                </p>
              )}
            </div>

            {/* Subjects */}
            <div>
              <Label className="text-sm font-medium">
                Subjects / Expertise *
              </Label>
              <div className="mt-1.5">
                <div className="flex flex-wrap gap-2 mb-2">
                  {subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-sm py-1 px-2">
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(subject)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select onValueChange={handleAddSubject}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonSubjects
                        .filter(s => !subjects.includes(s))
                        .map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or type a new subject..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                </div>
              </div>
              {state?.errors?.find(e => e.field === "subjects") && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.find(e => e.field === "subjects")?.message}
                </p>
              )}
              <input type="hidden" name="subjects" value={subjects.join(',')} />
            </div>

            {/* Hourly Rate and Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourlyRate" className="text-sm font-medium">
                  Hourly Rate (€)
                </Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="e.g., 100"
                  className="mt-1.5"
                />
                {state?.errors?.find(e => e.field === "hourlyRate") && (
                  <p className="text-sm text-red-500 mt-1">
                    {state.errors.find(e => e.field === "hourlyRate")?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="rating" className="text-sm font-medium">
                  Rating (1-5)
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="e.g., 5"
                  className="mt-1.5"
                />
                {state?.errors?.find(e => e.field === "rating") && (
                  <p className="text-sm text-red-500 mt-1">
                    {state.errors.find(e => e.field === "rating")?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <Label htmlFor="experience" className="text-sm font-medium">
                Experience Level
              </Label>
              <Select name="experience" value={experience} onValueChange={setExperience}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Error summary */}
            {state?.errors?.find(e => e.field === "general") && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {state.errors.find(e => e.field === "general")?.message}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/trainers">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}