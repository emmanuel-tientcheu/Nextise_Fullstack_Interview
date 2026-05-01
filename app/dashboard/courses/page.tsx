// app/(dashboard)/courses/page.tsx
'use client'

import { useCallback, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrainerResponseDTO } from "@/app/api/trainers/domaine/viewModels/TrainerResponseDTO"
import { CourseResponseDTO } from "@/app/api/courses/domaine/viewModels/CourseResponseDTO"
import { getAllCoursesAction } from "@/app/actions/course/getAllCourses.action"
import { getAllTrainersAction } from "@/app/actions/trainer/getAllTrainers.action"
import { CourseDataTable } from "@/components/features/courses/CourseDataTable"
import { mapCourseToTableRow } from "@/app/types/course-table"
import { columns } from "@/components/features/courses/CourseColumns"

interface CourseTableRowWithTrainer {
    id: string
    name: string
    date: Date
    subjects: string[]
    location: string
    participants: number
    price: number
    status: 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
    assignedTrainerId: string | null
    assignedTrainerName?: string
}

export default function CoursesPage() {
    const [loading, setLoading] = useState(true)
    const [tableData, setTableData] = useState<CourseTableRowWithTrainer[]>([])
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [stats, setStats] = useState({ total: 0, scheduled: 0, draft: 0, totalParticipants: 0 })

    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const loadData = useCallback(async () => {
        setLoading(true)
        try {
            const [coursesResult, trainersResult] = await Promise.all([
                getAllCoursesAction({ status: statusFilter !== "all" ? statusFilter as any : undefined }),
                getAllTrainersAction()
            ])

            if (!coursesResult.success) {
                setError(coursesResult.error || "Failed to load courses")
                return
            }

            const trainerMap = new Map<string, string>()
            if (trainersResult.success && trainersResult.trainers) {
                trainersResult.trainers.forEach((trainer: TrainerResponseDTO) => {
                    trainerMap.set(trainer.id, trainer.name)
                })
            }

            const data: CourseTableRowWithTrainer[] = coursesResult.courses.map((course: CourseResponseDTO) => {
                const row = mapCourseToTableRow(course)
                return {
                    ...row,
                    assignedTrainerName: row.assignedTrainerId
                        ? trainerMap.get(row.assignedTrainerId)
                        : undefined,
                }
            })

            setTableData(data)

            const allCourses = await getAllCoursesAction()
            if (allCourses.success) {
                const allData: CourseTableRowWithTrainer[] = allCourses.courses.map((course: CourseResponseDTO) => {
                    const row = mapCourseToTableRow(course)
                    return {
                        ...row,
                        assignedTrainerName: row.assignedTrainerId
                            ? trainerMap.get(row.assignedTrainerId)
                            : undefined,
                    }
                })

                setStats({
                    total: allCourses.total || allData.length,
                    scheduled: allData.filter((c: CourseTableRowWithTrainer) => c.status === 'SCHEDULED').length,
                    draft: allData.filter((c: CourseTableRowWithTrainer) => c.status === 'DRAFT').length,
                    totalParticipants: allData.reduce((sum: number, c: CourseTableRowWithTrainer) => sum + c.participants, 0),
                })
            }

        } catch (err) {
            setError("An unexpected error occurred")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [statusFilter])

    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1)  // Force le rechargement
    }

    const removeFromTable = (courseId: string) => {
        setTableData(prev => prev.filter(c => c.id !== courseId))
        setStats(prev => ({
            ...prev,
            total: prev.total - 1,
            scheduled: tableData.find(c => c.id === courseId)?.status === 'SCHEDULED' ? prev.scheduled - 1 : prev.scheduled,
            draft: tableData.find(c => c.id === courseId)?.status === 'DRAFT' ? prev.draft - 1 : prev.draft,
        }))
    }

    const updateInTable = (courseId: string, updates: Partial<CourseTableRowWithTrainer>) => {
        setTableData(prev => prev.map(c =>
            c.id === courseId ? { ...c, ...updates } : c
        ))
    }

    // Chargement initial ET rechargement quand refreshTrigger change
    useEffect(() => {
        loadData()
    }, [loadData, refreshTrigger])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <h3 className="font-semibold mb-1">Loading Error</h3>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 px-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
                <p className="text-gray-500 mt-1">View and manage all your courses</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Courses" value={stats.total} color="blue" />
                <StatCard title="Scheduled" value={stats.scheduled} color="green" />
                <StatCard title="Drafts" value={stats.draft} color="yellow" />
                <StatCard title="Total Participants" value={stats.totalParticipants} color="purple" />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Filter by status:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <CourseDataTable columns={columns} data={tableData} onRefresh={refreshData} onRemove={removeFromTable} onUpdate={updateInTable}/>
        </div>
    )
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
    const colorClasses: Record<string, string> = {
        blue: "border-blue-500",
        green: "border-green-500",
        yellow: "border-yellow-500",
        purple: "border-purple-500",
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${colorClasses[color]}`}>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    )
}