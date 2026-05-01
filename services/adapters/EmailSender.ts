import nodemailer from 'nodemailer'
import { IEmailSender } from "../ports/IEmailSender"
import { EmailTemplates } from '@/lib/email/EmailTemplates'
import { AssignmentEmailData, EmailResult } from '@/lib/email/types'


export class EmailSender implements IEmailSender {
    private transporter: nodemailer.Transporter
    private fromEmail: string
    private configured: boolean

    constructor() {
        this.fromEmail = process.env.EMAIL_FROM || 'noreply@seminar-platform.com'

        const host = process.env.EMAIL_HOST || 'localhost'
        const port = parseInt(process.env.EMAIL_PORT || '1025')

        try {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: false,
                tls: {
                    rejectUnauthorized: false
                }
            })
            this.configured = true
            console.log(`📧 EmailSender configured with ${host}:${port}`)
        } catch (error) {
            console.error('❌ EmailSender configuration failed:', error)
            this.configured = false
            this.transporter = null as any
        }
    }

    async sendAssignmentEmail(data: AssignmentEmailData): Promise<EmailResult> {
        if (!this.isConfigured()) {
            return {
                success: false,
                error: 'Email service not configured'
            }
        }

        try {
            const subject = EmailTemplates.getSubject(data)
            const html = EmailTemplates.getHtmlContent(data)
            const text = EmailTemplates.getTextContent(data)

            const info = await this.transporter.sendMail({
                from: `"Seminar Platform" <${this.fromEmail}>`,
                to: data.trainer.trainerEmail,
                subject,
                html,
                text,
            })


            return {
                success: true,
                messageId: info.messageId,
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }

    async sendTestEmail(to: string): Promise<EmailResult> {
        if (!this.isConfigured()) {
            return {
                success: false,
                error: 'Email service not configured'
            }
        }

        try {
            const info = await this.transporter.sendMail({
                from: `"Seminar Platform" <${this.fromEmail}>`,
                to,
                subject: 'Test Email from Seminar Platform',
                html: `
          <h1>✓ Test Email</h1>
          <p>If you receive this, your email configuration is working!</p>
          <hr>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        `,
                text: 'Test Email - Your email configuration is working!',
            })

            return {
                success: true,
                messageId: info.messageId,
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }

    isConfigured(): boolean {
        return this.configured && this.transporter !== null
    }
}