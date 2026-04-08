/**
 * Email Service
 * Handles email sending with nodemailer
 */

import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
    fromName?: string;
    replyTo?: string;
    templateId?: string;
    templateData?: Record<string, any>;
}

interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

class EmailService {
    private transporter: nodemailer.Transporter | null = null;
    private config: EmailConfig | null = null;

    constructor() {
        this.initializeTransporter();
    }

    private initializeTransporter() {
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = parseInt(process.env.SMTP_PORT || '587');
        const secure = process.env.SMTP_SECURE === 'true';
        const user = process.env.SMTP_USER || '';
        const pass = process.env.SMTP_PASS || '';

        if (!user || !pass) {
            console.warn('Email service: SMTP credentials not configured');
            return;
        }

        this.config = {
            host,
            port,
            secure,
            auth: { user, pass },
        };

        this.transporter = nodemailer.createTransport(this.config);
    }

    async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
        if (!this.transporter) {
            return { success: false, error: 'Email transporter not initialized' };
        }

        try {
            const fromEmail = options.from || process.env.SMTP_FROM_EMAIL || 'noreply@example.com';
            const fromName = options.fromName || process.env.SMTP_FROM_NAME || 'Dr Obinna Awiaka';

            const mailOptions = {
                from: `"${fromName}" <${fromEmail}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || this.htmlToText(options.html),
                replyTo: options.replyTo,
            };

            const info = await this.transporter.sendMail(mailOptions);

            return {
                success: true,
                messageId: info.messageId,
            };
        } catch (error) {
            console.error('Email send error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async sendBulkEmails(emails: EmailOptions[]): Promise<{ sent: number; failed: number; errors: string[] }> {
        let sent = 0;
        let failed = 0;
        const errors: string[] = [];

        for (const email of emails) {
            const result = await this.sendEmail(email);
            if (result.success) {
                sent++;
            } else {
                failed++;
                errors.push(result.error || 'Unknown error');
            }
        }

        return { sent, failed, errors };
    }

    private htmlToText(html: string): string {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    async verifyConnection(): Promise<boolean> {
        if (!this.transporter) {
            return false;
        }

        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error('Email connection verification failed:', error);
            return false;
        }
    }

    isConfigured(): boolean {
        return this.transporter !== null;
    }
}

export const emailService = new EmailService();
export default emailService;
