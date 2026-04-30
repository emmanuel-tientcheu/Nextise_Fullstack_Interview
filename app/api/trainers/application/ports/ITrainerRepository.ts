import { CreateTrainerDTO } from "../../infrastructure/next/CreateTrainerDTO";
import { Trainer } from "../../domaine/models/Trainer";
import { TrainerFiltersDTO } from "../../infrastructure/next/TrainerFiltersDTO";
import { UpdateTrainerDTO } from "../../infrastructure/next/UpdateTrainerDTO";

export interface ITrainerRepository {
    /**
     * Créer un nouveau formateur
     */
    create(data: CreateTrainerDTO): Promise<Trainer>

    /**
     * Récupérer un formateur par son ID
     */
    findById(id: string): Promise<Trainer | null>

    /**
     * Récupérer un formateur par son email
     */
    findByEmail(email: string): Promise<Trainer | null>

    /**
     * Récupérer tous les formateurs (avec filtres optionnels)
     */
    findAll(
        filters?: TrainerFiltersDTO,
        page?: number,
        limit?: number
    ): Promise<{ trainers: Trainer[]; total: number }>

    /**
     * Mettre à jour un formateur
     */
    update(id: string, data: UpdateTrainerDTO): Promise<Trainer>

    /**
     * Supprimer définitivement un formateur
     */
    delete(id: string): Promise<void>


}