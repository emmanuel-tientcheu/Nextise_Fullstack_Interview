import { NextRequest } from 'next/server'
import { trainerContainer } from '../infrastructure/next/TrainerControllerConfig'

const trainerController = trainerContainer.getTrainerController()

// GET /api/trainers/email/test@example.com - Récupérer un formateur par email
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const { email } = await params
  return trainerController.getByEmail(email)
}