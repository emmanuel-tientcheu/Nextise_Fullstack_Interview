// app/api/trainers/route.ts
import { NextRequest } from 'next/server'
import { trainerContainer } from './infrastructure/next/TrainerControllerConfig'

const trainerController = trainerContainer.getTrainerController()

// GET /api/trainers - Récupérer tous les formateurs (avec filtres)
export async function GET(request: NextRequest) {
  return trainerController.getAll(request)
}

// POST /api/trainers - Créer un formateur
export async function POST(request: NextRequest) {
  return trainerController.create(request)
}