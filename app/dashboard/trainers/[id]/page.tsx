// app/(dashboard)/trainers/[id]/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getTrainerByIdAction } from "@/app/actions/trainer/getTrainerById.action"
import { deleteTrainerAction } from "@/app/actions/trainer/deleteTrainer.action"
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
  Mail,
  MapPin,
  Euro,
  Star,
  Briefcase,
  BookOpen,
  Loader2,
} from "lucide-react"

interface TrainerShowPageProps {
  params: Promise<{ id: string }>
}

interface TrainerData {
  id: string
  name: string
  email: string
  location: string
  subjects: string[]
  hourlyRate: number | null
  rating: number | null
  experience: string | null
  createdAt: Date
  updatedAt: Date
}

export default function TrainerShowPage({ params }: TrainerShowPageProps) {
  const router = useRouter()
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les données du trainer
  useEffect(() => {
    const loadTrainer = async () => {
      const { id } = await params
      const result = await getTrainerByIdAction(id)

      if (result.success && result.trainer) {
        setTrainer(result.trainer)
      } else {
        router.push("/dashboard/trainers?error=Trainer not found")
      }

      setIsLoading(false)
    }

    loadTrainer()
  }, [params, router])

  // ✅ Version simplifiée : appel direct de l'action
  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    
    const formData = new FormData()
    formData.append("id", trainer!.id)
    
    const result = await deleteTrainerAction(formData)
    
    if (result.success) {
      router.push("/dashboard/trainers?success=Trainer deleted successfully")
      router.refresh()
    } else {
      setError(result.error)
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 flex justify-center items-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!trainer) {
    return null
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* Header avec actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/trainers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trainers
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{trainer.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/trainers/${trainer.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Affichage de l'erreur */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Grille d'informations (identique) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ... reste du contenu identique ... */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Basic contact and location details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${trainer.email}`} className="text-blue-600 hover:underline">
                  {trainer.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-900">{trainer.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Experience Level</p>
                <p className="text-gray-900">{trainer.experience || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills & Expertise</CardTitle>
            <CardDescription>Technical subjects and specializations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Subjects</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {trainer.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                  {trainer.subjects.length === 0 && (
                    <p className="text-gray-500">No subjects specified</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rates & Rating</CardTitle>
            <CardDescription>Pricing and performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Euro className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Hourly Rate</p>
                <p className="text-gray-900">
                  {trainer.hourlyRate ? `${trainer.hourlyRate}€ / hour` : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center gap-1">
                  <span className="text-gray-900">
                    {trainer.rating ? `${trainer.rating}/5` : "No rating yet"}
                  </span>
                  {trainer.rating && (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (trainer.rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Information</CardTitle>
            <CardDescription>Creation and update timestamps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-gray-900">
                  {new Date(trainer.createdAt).toLocaleDateString()} at{" "}
                  {new Date(trainer.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-900">
                  {new Date(trainer.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(trainer.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialog pour la suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{trainer.name}</strong>. This action cannot be undone.
              All courses associated with this trainer will be unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Trainer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}