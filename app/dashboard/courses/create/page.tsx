// app/(dashboard)/courses/create/page.tsx
'use client'

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useFormState } from "react-dom"
import { createCourseAction } from "@/app/actions/course/createCourse.action"
import { getAllTrainersAction } from "@/app/actions/trainer/getAllTrainers.action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Calendar, MapPin, Users, Euro, BookOpen, User } from "lucide-react"
import { TrainerResponseDTO } from "@/app/api/trainers/domaine/viewModels/TrainerResponseDTO"

const initialState = {
  success: false,
  errors: null as { field: string; message: string }[] | null,
}

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "SCHEDULED", label: "Scheduled" },
]

const commonSubjects = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
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

interface TrainerOption {
  id: string
  name: string
}


export default function CreateCoursePage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createCourseAction, initialState)
  const [subjects, setSubjects] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
 const [trainers, setTrainers] =  useState<TrainerOption[]>([]) 

  // Load trainers for assignment
  useEffect(() => {
    const loadTrainers = async () => {
      const result = await getAllTrainersAction()
      if (result.success && result.trainers) {
        const trainerOptions: TrainerOption[] = result.trainers.map((t: TrainerResponseDTO) => ({ 
          id: t.id, 
          name: t.name 
        }))
        setTrainers(trainerOptions)
      }
    }
    loadTrainers()
  }, [])

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard/courses?success=Course created successfully")
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

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Course</CardTitle>
          <CardDescription>
            Fill in the information below to create a new course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Course Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Advanced React Workshop"
                className="mt-1.5"
                required
              />
              {state?.errors?.find(e => e.field === "name") && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.find(e => e.field === "name")?.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Course Date *
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                className="mt-1.5"
                required
              />
              {state?.errors?.find(e => e.field === "date") && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.find(e => e.field === "date")?.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <Input
                id="location"
                name="location"
                type="text"
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
              <Label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Subjects / Topics *
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

            {/* Participants and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="participants" className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participants *
                </Label>
                <Input
                  id="participants"
                  name="participants"
                  type="number"
                  min="1"
                  placeholder="e.g., 12"
                  className="mt-1.5"
                  required
                />
                {state?.errors?.find(e => e.field === "participants") && (
                  <p className="text-sm text-red-500 mt-1">
                    {state.errors.find(e => e.field === "participants")?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="price" className="text-sm font-medium flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Course Price (€) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 2500"
                  className="mt-1.5"
                  required
                />
                {state?.errors?.find(e => e.field === "price") && (
                  <p className="text-sm text-red-500 mt-1">
                    {state.errors.find(e => e.field === "price")?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Trainer Price and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trainerPrice" className="text-sm font-medium flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Trainer Price (€) *
                </Label>
                <Input
                  id="trainerPrice"
                  name="trainerPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 800"
                  className="mt-1.5"
                  required
                />
                {state?.errors?.find(e => e.field === "trainerPrice") && (
                  <p className="text-sm text-red-500 mt-1">
                    {state.errors.find(e => e.field === "trainerPrice")?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="assignedTrainerId" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assign Trainer (Optional)
                </Label>
                <Select name="assignedTrainerId">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {trainers.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status and Notes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select name="status" defaultValue="DRAFT">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional notes about the course..."
                  className="mt-1.5"
                  rows={1}
                />
              </div>
            </div>

            {/* Error summary */}
            {state?.errors?.find(e => e.field === "general") && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {state.errors.find(e => e.field === "general")?.message}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/courses">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                {isPending ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}