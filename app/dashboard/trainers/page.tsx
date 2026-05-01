import { getAllTrainersAction } from "@/app/actions/trainer/getAllTrainers.action"
import { mapTrainerToTableRow } from "@/app/types/trainer-table"
import { columns } from "@/components/features/trainers/TrainerColumns"
import { TrainerDataTable } from "@/components/features/trainers/TrainerDataTable"


export default async function TrainersPage() {
  const result = await getAllTrainersAction()

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {result.error}
        </div>
      </div>
    )
  }

  const tableData = result.trainers.map(mapTrainerToTableRow)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Trainers Management</h1>
      <TrainerDataTable columns={columns} data={tableData} />
    </div>
  )
}