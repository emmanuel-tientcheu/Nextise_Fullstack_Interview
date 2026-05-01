// app/(dashboard)/courses/[id]/edit/page.tsx
'use client'

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useFormState } from "react-dom"
import { updateCourseAction } from "@/app/actions/course/updateCourse.action"
import { getCourseByIdAction } from "@/app/actions/course/getCourseById.action"
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
import { X, Calendar, MapPin, Users, Euro, BookOpen, User, Loader2 } from "lucide-react"
import type { TrainerResponseDTO } from "@/app/api/trainers/domaine/viewModels/TrainerResponseDTO"

const initialState = {
  success: false,
  errors: null as { field: string; message: string }[] | null,
}

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
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

interface EditCoursePageProps {
  params: Promise<{ id: string }>
}

interface TrainerOption {
  id: string
  name: string
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(updateCourseAction, initialState)
  const [isLoading, setIsLoading] = useState(true)
  const [courseId, setCourseId] = useState<string>("")
  
  // Form state
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [subjects, setSubjects] = useState<string[]>([])
  const [participants, setParticipants] = useState("")
  const [price, setPrice] = useState("")
  const [trainerPrice, setTrainerPrice] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("DRAFT")
  const [assignedTrainerId, setAssignedTrainerId] = useState("")
  
  const [inputValue, setInputValue] = useState("")
  const [trainers, setTrainers] = useState<TrainerOption[]>([])

  // Load trainers list
  useEffect(() => {
    const loadTrainers = async () => {
      const result = await getAllTrainersAction()
      if (result.success && result.trainers) {
        setTrainers(result.trainers.map((trainer: TrainerResponseDTO) => ({ 
          id: trainer.id, 
          name: trainer.name 
        })))
      }
    }
    loadTrainers()
  }, [])

  // Load course data
  useEffect(() => {
    const loadCourse = async () => {
      const { id } = await params
      setCourseId(id)
      
      const result = await getCourseByIdAction(id)
      
      if (result.success && result.course) {
        const course = result.course
        setName(course.name)
        // Format date for datetime-local input
        const dateObj = course.date instanceof Date ? course.date : new Date(course.date)
        setDate(dateObj.toISOString().slice(0, 16))
        setLocation(course.location)
        setSubjects(course.subjects)
        setParticipants(course.participants.toString())
        setPrice(course.price.toString())
        setTrainerPrice(course.trainerPrice.toString())
        setNotes(course.notes || "")
        setStatus(course.status)
        setAssignedTrainerId(course.assignedTrainerId || "none")
      } else {
        router.push("/dashboard/courses?error=Course not found")
      }
      
      setIsLoading(false)
    }
    
    loadCourse()
  }, [params, router])

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      router.push(`/dashboard/courses/${courseId}?success=Course updated successfully`)
    }
  }, [state?.success, router, courseId])

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
      <div className="container max-w-4xl mx-auto py-8 flex justify-center items-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Course</CardTitle>
          <CardDescription>
            Update the course information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Hidden ID */}
            <input type="hidden" name="id" value={courseId} />

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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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

            {/* Trainer Price and Assigned Trainer */}
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
                  value={trainerPrice}
                  onChange={(e) => setTrainerPrice(e.target.value)}
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
                  Assign Trainer
                </Label>
                <Select 
                  name="assignedTrainerId" 
                  value={assignedTrainerId} 
                  onValueChange={setAssignedTrainerId}
                >
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
                <Select name="status" value={status} onValueChange={setStatus}>
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                <Link href={`/dashboard/courses/${courseId}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}