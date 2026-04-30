// app/api/trainers/[id]/route.ts
import { NextRequest } from 'next/server'
import { trainerContainer } from '../infrastructure/next/TrainerControllerConfig'

const trainerController = trainerContainer.getTrainerController()

// GET /api/trainers/123 - Récupérer un formateur par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return trainerController.getById(id)
}

// PUT /api/trainers/123 - Mettre à jour un formateur
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return trainerController.update(request, id)
}

// DELETE /api/trainers/123 - Supprimer un formateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return trainerController.delete(id)
}