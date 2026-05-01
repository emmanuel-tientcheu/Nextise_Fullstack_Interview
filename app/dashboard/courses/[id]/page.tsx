// app/(dashboard)/courses/[id]/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getCourseByIdAction } from "@/app/actions/course/getCourseById.action"
import { deleteCourseAction } from "@/app/actions/course/deleteCourse.action"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Euro,
  BookOpen,
  User,
  FileText,
  Clock,
  Loader2,
} from "lucide-react"

interface CourseData {
  id: string
  name: string
  date: Date
  subjects: string[]
  location: string
  participants: number
  notes: string | null
  price: number
  trainerPrice: number
  status: 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  assignedTrainerId: string | null
  assignedTrainerName?: string
  createdAt: Date
  updatedAt: Date
}

interface TrainerInfo {
  id: string
  name: string
  email: string
}

interface CourseShowPageProps {
  params: Promise<{ id: string }>
}

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
}

const statusLabels = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export default function CourseShowPage({ params }: CourseShowPageProps) {
  const router = useRouter()
  const [course, setCourse] = useState<CourseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load course data
  useEffect(() => {
    const loadCourse = async () => {
      const { id } = await params
      const result = await getCourseByIdAction(id)

      if (result.success && result.course) {
        setCourse({
          ...result.course,
          date: result.course.date instanceof Date ? result.course.date : new Date(result.course.date),
        })
      } else {
        router.push("/dashboard/courses?error=Course not found")
      }

      setIsLoading(false)
    }

    loadCourse()
  }, [params, router])

  const handleDelete = async () => {
    setIsDeleting(true)
    const formData = new FormData()
    formData.append("id", course!.id)
    formData.append("redirectAfter", "/dashboard/courses")
    const result = await deleteCourseAction(formData)
    if (result.success) {
      router.push("/dashboard/courses?success=Course deleted successfully")
      router.refresh()
    }
    setIsDeleting(false)
    setShowDeleteDialog(false)
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 flex justify-center items-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/courses">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <Badge className={statusColors[course.status]}>
            {statusLabels[course.status]}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/courses/${course.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Course details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Information</CardTitle>
            <CardDescription>Basic details about the course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="text-gray-900">
                  {new Date(course.date).toLocaleDateString()} at{" "}
                  {new Date(course.date).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-900">{course.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="text-gray-900">{course.participants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Information</CardTitle>
            <CardDescription>Pricing details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Euro className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Course Price</p>
                <p className="text-gray-900">{course.price.toLocaleString()}€</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Euro className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Trainer Price</p>
                <p className="text-gray-900">{course.trainerPrice.toLocaleString()}€</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5" />
              <div>
                <p className="text-sm text-gray-500">Profit Margin</p>
                <p className="text-gray-900">
                  {(course.price - course.trainerPrice).toLocaleString()}€
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects / Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subjects & Topics</CardTitle>
            <CardDescription>Course curriculum and covered topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Topics</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {course.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                  {course.subjects.length === 0 && (
                    <p className="text-gray-500">No subjects specified</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Trainer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assigned Trainer</CardTitle>
            <CardDescription>Trainer responsible for this course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Trainer</p>
                {course.assignedTrainerId ? (
                  <Link 
                    href={`/dashboard/trainers/${course.assignedTrainerId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {course.assignedTrainerName || "View Trainer"}
                  </Link>
                ) : (
                  <p className="text-gray-500 italic">No trainer assigned yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {course.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
              <CardDescription>Additional information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-gray-700 whitespace-pre-wrap">{course.notes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">System Information</CardTitle>
            <CardDescription>Creation and update timestamps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-gray-900">
                  {new Date(course.createdAt).toLocaleDateString()} at{" "}
                  {new Date(course.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-900">
                  {new Date(course.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(course.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{course.name}</strong>. This action cannot be undone.
              All trainer assignments will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Course"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}