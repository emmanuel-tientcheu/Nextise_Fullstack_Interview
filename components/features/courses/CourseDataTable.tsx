// components/features/courses/CourseDataTable.tsx
'use client'

import { useState } from "react"
import {
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CourseTableRow } from "@/app/types/course-table"
import { CourseActions } from "./CourseActions"

interface CourseDataTableProps {
    columns: ColumnDef<CourseTableRow>[]
    data: CourseTableRow[]
    onRefresh?: () => void
    onRemove?: (id: string) => void
    onUpdate?: (id: string, updates: Partial<CourseTableRow>) => void
}

export function CourseDataTable({ columns, data, onRefresh, onRemove, onUpdate }: CourseDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")

    const columnsWithRefresh = columns.map(col => {
        if (col.id === 'actions') {
            return {
                ...col,
                cell: (props: any) => <CourseActions course={props.row.original} onSuccess={onRefresh} onRemove={onRemove} onUpdate={onUpdate}/>
            }
        }
        return col
    })

    const table = useReactTable({
        data,
        columns: columnsWithRefresh,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
    })

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
                <Input
                    placeholder="Search for a course..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm bg-white border-gray-300 focus:border-blue-500"
                />
                <Button
                    onClick={() => window.location.href = "/dashboard/courses/create"}
                    className=" text-white"
                >
                    + New Course
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-gray-200">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-gray-600 font-semibold">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-gray-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    No courses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-gray-500">
                    {table.getFilteredRowModel().rows.length} course(s)
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}