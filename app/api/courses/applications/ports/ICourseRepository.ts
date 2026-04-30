// lib/repositories/interfaces/ICourseRepository.ts

import { Course } from "../../domaine/models/Course";
import { CourseFiltersDTO } from "../../infrastructure/next/CourseFiltersDTO";
import { CreateCourseDTO } from "../../infrastructure/next/CreateCourseDTO";
import { UpdateCourseDTO } from "../../infrastructure/next/UpdateCourseDTO";

export interface ICourseRepository {
    /**
     * Créer une nouvelle formation
     */
    create(data: CreateCourseDTO): Promise<Course>

    /**
     * Récupérer une formation par son ID
     */
    findById(id: string): Promise<Course | null>

    /**
     * Récupérer toutes les formations (avec filtres optionnels et pagination)
     * @param filters - Filtres optionnels (status, location, date, etc.)
     * @param page - Numéro de la page (optionnel)
     * @param limit - Nombre d'éléments par page (optionnel)
     */
    findAll(
        filters?: CourseFiltersDTO,
        page?: number,
        limit?: number
    ): Promise<{ courses: Course[]; total: number }>

    /**
     * Mettre à jour une formation
     */
    update(id: string, data: UpdateCourseDTO): Promise<Course>

    /**
     * Supprimer définitivement une formation de la base de données
     */
    delete(id: string): Promise<void>


    /**
     * Récupérer les formations à venir (date >= aujourd'hui)
     */
    findUpcoming(): Promise<Course[]>

    /**
     * Récupérer les formations passées (date < aujourd'hui)
     */
    findPast(): Promise<Course[]>

    /**
     * Vérifier les conflits de lieu (même lieu, même jour)
     */
    findLocationConflicts(location: string, date: Date, excludeCourseId?: string): Promise<Course[]>

    /**
     * Vérifier les conflits de formateur (même formateur, même jour)
     */
    findTrainerConflicts(trainerId: string, date: Date, excludeCourseId?: string): Promise<Course[]>

    /**
     * Assigner un formateur à une formation
     */
    assignTrainer(courseId: string, trainerId: string): Promise<Course>

    /**
     * Désassigner le formateur d'une formation
     */
    unassignTrainer(courseId: string): Promise<Course>

    /**
     * Récupérer les statistiques des formations
     */
    getStats(): Promise<{
        total: number
        draft: number
        scheduled: number
        completed: number
        cancelled: number
        totalRevenue: number
        avgParticipants: number
    }>
}