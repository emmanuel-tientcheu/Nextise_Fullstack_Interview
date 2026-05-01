// components/courses/CourseColumns.tsx
'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"
import { CourseActions } from "./CourseActions"
import { CourseTableRow } from "@/app/types/course-table"

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

export const columns: ColumnDef<CourseTableRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-700 hover:text-gray-900"
        >
          Course
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <span className="font-medium text-gray-900">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-700 hover:text-gray-900"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("date")
      
      // ✅ Convertir en objet Date si ce n'est pas déjà fait
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue as Date
      
      // ✅ Vérifier si la date est valide
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return <span className="text-gray-400">Invalid date</span>
      }
      
      return <span className="text-gray-600">{date.toLocaleDateString()}</span>
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-gray-600">{row.getValue("location")}</span>,
  },
  {
    accessorKey: "subjects",
    header: "Subjects",
    cell: ({ row }) => {
      const subjects = row.getValue("subjects") as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {subjects.slice(0, 2).map((subject) => (
            <Badge key={subject} variant="secondary" className="bg-gray-100 text-gray-700">
              {subject}
            </Badge>
          ))}
          {subjects.length > 2 && (
            <Badge variant="outline" className="text-gray-500">
              +{subjects.length - 2}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "assignedTrainerName",
    header: "Trainer",
    cell: ({ row }) => {
      const trainerName = row.getValue("assignedTrainerName") as string | undefined
      return (
        <span className="text-gray-600">
          {trainerName || <span className="text-gray-400 italic">Not assigned</span>}
        </span>
      )
    },
  },
  {
    accessorKey: "participants",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-700 hover:text-gray-900"
        >
          Participants
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <span className="text-gray-600">{row.getValue("participants")}</span>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-700 hover:text-gray-900"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as number
      return <span className="text-gray-600">{price.toLocaleString()}€</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusColors
      return (
        <Badge className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CourseActions course={row.original} />,
  },
]