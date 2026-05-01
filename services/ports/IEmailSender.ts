import { AssignmentEmailData } from "@/lib/email/types"
import { EmailResult } from "@/lib/email/types"

/**
 * Interface pour le service d'envoi d'email
 */
export interface IEmailSender {
    /**
     * Envoyer un email d'assignation à un formateur
     * @param data - Données de l'assignation (cours + formateur)
     * @returns Résultat de l'envoi
     */
    sendAssignmentEmail(data: AssignmentEmailData): Promise<EmailResult>

    /**
     * Envoyer un email de test
     * @param to - Adresse email du destinataire
     * @returns Résultat de l'envoi
     */
    sendTestEmail(to: string): Promise<EmailResult>

    /**
     * Vérifier si le service est correctement configuré
     */
    isConfigured(): boolean
}