'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { TrainerTableRow } from "@/app/types/trainer-table"
import { TrainerActions } from "./TrainerActions"


export const columns: ColumnDef<TrainerTableRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "subjects",
    header: "Subjects",
    cell: ({ row }) => {
      const subjects = row.getValue("subjects") as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {subjects.slice(0, 2).map((subject) => (
            <Badge key={subject} variant="secondary" className="text-xs">
              {subject}
            </Badge>
          ))}
          {subjects.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{subjects.length - 2}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "hourlyRate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hourly Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rate = row.getValue("hourlyRate") as number | null
      return rate ? `${rate}€/h` : "-"
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number | null
      if (!rating) return "-"
      return (
        <div className="flex items-center gap-1">
          <span>⭐</span>
          <span>{rating}/5</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const trainer = row.original
      return <TrainerActions trainer={trainer} />
    },
  },
]