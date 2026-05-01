// components/courses/CourseActions.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Eye, Pencil, Trash2, UserPlus, UserMinus } from "lucide-react"
import { deleteCourseAction } from "@/app/actions/course/deleteCourse.action"
import { assignTrainerToCourseAction } from "@/app/actions/course/assignTrainerToCourse.action"
import { unassignTrainerFromCourseAction } from "@/app/actions/course/unassignTrainerFromCourse.action"
import { getAllTrainersAction } from "@/app/actions/trainer/getAllTrainers.action"
import { CourseTableRow } from "@/app/types/course-table"
import { TrainerResponseDTO } from "@/app/api/trainers/domaine/viewModels/TrainerResponseDTO"
import { toast } from "sonner"

interface CourseActionsProps {
    course: CourseTableRow
    onSuccess?: () => void
    onRemove?: (id: string) => void
    onUpdate?: (id: string, updates: Partial<CourseTableRow>) => void
}

interface TrainerOption {
    id: string
    name: string
}

export function CourseActions({ course, onSuccess, onRemove, onUpdate }: CourseActionsProps) {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showAssignDialog, setShowAssignDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isAssigning, setIsAssigning] = useState(false)
    const [selectedTrainerId, setSelectedTrainerId] = useState("")
    const [trainers, setTrainers] = useState<TrainerOption[]>([])

    // Load trainers list for assignment
    useEffect(() => {
        const loadTrainers = async () => {
            const result = await getAllTrainersAction()
            if (result.success && result.trainers) {
                const trainerOptions: TrainerOption[] = result.trainers.map((trainer: TrainerResponseDTO) => ({
                    id: trainer.id,
                    name: trainer.name
                }))
                setTrainers(trainerOptions)
            }
        }
        if (showAssignDialog) {
            loadTrainers()
        }
    }, [showAssignDialog])

    const handleDelete = async () => {
        onRemove?.(course.id)
        setShowDeleteDialog(false)

        try {
            const formData = new FormData()
            formData.append("id", course.id)
            const result = await deleteCourseAction(formData)

            if (!result.success) {
                console.error("Delete failed:", result.error)
                onSuccess?.() // refreshData pour restaurer
            }
        } catch (error) {
            console.error("Delete error:", error)
            onSuccess?.() // refreshData pour restaurer
        } finally {
            setIsDeleting(false)
        }
    }

    const handleAssign = async () => {
        if (!selectedTrainerId) return
        setIsAssigning(true)

        // Sauvegarde pour rollback
        const previousTrainerId = course.assignedTrainerId
        const previousTrainerName = course.assignedTrainerName

        // Mise à jour optimiste
        const trainer = trainers.find(t => t.id === selectedTrainerId)
        onUpdate?.(course.id, {
            assignedTrainerId: selectedTrainerId,
            assignedTrainerName: trainer?.name
        })
        setShowAssignDialog(false)
        setSelectedTrainerId("")

        try {
            const formData = new FormData()
            formData.append("courseId", course.id)
            formData.append("trainerId", selectedTrainerId)
            const result = await assignTrainerToCourseAction(formData)

            if (!result.success) {
                // Rollback + toast erreur
                onUpdate?.(course.id, {
                    assignedTrainerId: previousTrainerId,
                    assignedTrainerName: previousTrainerName
                })
                toast.error(result.error ?? "Assignment failed")
            } else {
                toast.success(`${trainer?.name} assigned successfully`)
            }
        } catch {
            onUpdate?.(course.id, {
                assignedTrainerId: previousTrainerId,
                assignedTrainerName: previousTrainerName
            })
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsAssigning(false)
        }
    }

    const handleUnassign = async () => {
        onUpdate?.(course.id, {
            assignedTrainerId: null,
            assignedTrainerName: undefined
        })

        try {
            const formData = new FormData()
            formData.append("courseId", course.id)
            const result = await unassignTrainerFromCourseAction(formData)

            if (!result.success) {
                onSuccess?.()
            }
        } catch {
            onSuccess?.()
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/courses/${course.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/courses/${course.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign Trainer
                    </DropdownMenuItem>
                    {course.assignedTrainerId && (
                        <DropdownMenuItem onClick={handleUnassign}>
                            <UserMinus className="mr-2 h-4 w-4" />
                            Unassign Trainer
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{course.name}</strong>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Assign Trainer Dialog */}
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Trainer</DialogTitle>
                        <DialogDescription>
                            Choose a trainer to assign to "{course.name}".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={selectedTrainerId} onValueChange={setSelectedTrainerId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a trainer" />
                            </SelectTrigger>
                            <SelectContent>
                                {trainers.map((trainer) => (
                                    <SelectItem key={trainer.id} value={trainer.id}>
                                        {trainer.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAssign} disabled={!selectedTrainerId || isAssigning}>
                            {isAssigning ? "Assigning..." : "Assign"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}