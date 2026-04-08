/**
 * Notification Service
 * Handles sending notifications to subscribers via email and SMS
 */

import { Core } from '@strapi/strapi';
import { emailService } from './email';
import { smsService } from './sms';

interface NotificationPayload {
    type: 'new-post' | 'new-service' | 'welcome' | 'booking' | 'order' | 'contact' | 'custom';
    entityId?: string;
    entityType?: string;
    templateSlug?: string;
    templateData?: Record<string, any>;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    channel?: 'email' | 'sms' | 'both';
}

interface Subscriber {
    id: number;
    email: string;
    firstName?: string;
    phone?: string;
    status: 'subscribed' | 'unsubscribed' | 'bounced';
    notificationPreferences?: {
        email: boolean;
        sms: boolean;
    };
}

class NotificationService {
    private strapi: Core.Strapi;

    constructor(strapi: Core.Strapi) {
        this.strapi = strapi;
    }

    async notifySubscribers(payload: NotificationPayload): Promise<{ sent: number; failed: number }> {
        try {
            // Get all active subscribers
            const subscribers = await this.strapi.entityService.findMany('api::newsletter-subscriber.newsletter-subscriber', {
                filters: {
                    status: 'subscribed',
                },
            });

            if (!subscribers || !Array.isArray(subscribers) || subscribers.length === 0) {
                this.strapi.log.info('No active subscribers to notify');
                return { sent: 0, failed: 0 };
            }

            // Get email template
            const template = await this.getEmailTemplate(payload.templateSlug || payload.type);
            if (!template) {
                this.strapi.log.error(`Email template not found for: ${payload.templateSlug || payload.type}`);
                return { sent: 0, failed: subscribers.length };
            }

            let sent = 0;
            let failed = 0;

            // Process each subscriber
            for (const subscriber of subscribers) {
                try {
                    const subscriberData = subscriber as any;
                    const channel = payload.channel || 'email';

                    // Send email notification
                    if (channel === 'email' || channel === 'both') {
                        const emailResult = await this.sendEmailNotification(subscriberData, template, payload);
                        if (emailResult.success) {
                            sent++;
                        } else {
                            failed++;
                        }
                    }

                    // Send SMS notification (only for urgent/important or if explicitly requested)
                    if ((channel === 'sms' || channel === 'both') && subscriberData.phone) {
                        const shouldSendSMS = payload.priority === 'urgent' ||
                            payload.priority === 'high' ||
                            channel === 'sms';

                        if (shouldSendSMS) {
                            await this.sendSMSNotification(subscriberData, payload);
                        }
                    }
                } catch (error) {
                    this.strapi.log.error(`Failed to notify subscriber ${(subscriber as any).id}:`, error);
                    failed++;
                }
            }

            return { sent, failed };
        } catch (error) {
            this.strapi.log.error('Notification service error:', error);
            return { sent: 0, failed: 0 };
        }
    }

    private async getEmailTemplate(slug: string): Promise<any> {
        const templates = await this.strapi.entityService.findMany('api::email-template.email-template' as any, {
            filters: {
                slug: slug,
                isActive: true,
            },
        });

        return templates && Array.isArray(templates) && templates.length > 0 ? templates[0] : null;
    }

    private async sendEmailNotification(
        subscriber: any,
        template: any,
        payload: NotificationPayload
    ): Promise<{ success: boolean; error?: string }> {
        try {
            // Prepare template data
            const templateData = {
                ...payload.templateData,
                subscriberName: subscriber.firstName || 'Valued Subscriber',
                subscriberEmail: subscriber.email,
                unsubscribeUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`,
            };

            // Replace template variables
            const subject = this.replaceTemplateVariables(template.subject, templateData);
            const htmlBody = this.replaceTemplateVariables(template.htmlBody, templateData);
            const textBody = template.textBody
                ? this.replaceTemplateVariables(template.textBody, templateData)
                : undefined;

            // Send email
            const result = await emailService.sendEmail({
                to: subscriber.email,
                subject,
                html: htmlBody,
                text: textBody,
                from: template.fromEmail,
                fromName: template.fromName,
                replyTo: template.replyTo,
            });

            // Log email
            await this.strapi.entityService.create('api::email-log.email-log' as any, {
                data: {
                    recipient: subscriber.email,
                    recipientName: subscriber.firstName,
                    subject,
                    template: template.id,
                    status: result.success ? 'sent' : 'failed',
                    sentAt: result.success ? new Date().toISOString() : null,
                    errorMessage: result.error,
                    notificationType: payload.type,
                    recipientType: 'all-subscribers',
                    relatedEntityId: payload.entityId,
                    relatedEntityType: payload.entityType,
                },
            });

            return result;
        } catch (error) {
            this.strapi.log.error('Email notification error:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    private async sendSMSNotification(
        subscriber: any,
        payload: NotificationPayload
    ): Promise<void> {
        try {
            if (!subscriber.phone || !smsService.isConfigured()) {
                return;
            }

            // Create SMS message based on notification type
            const message = this.createSMSMessage(payload);

            // Send SMS
            const result = await smsService.sendSMS({
                to: subscriber.phone,
                message,
            });

            // Log SMS
            await this.strapi.entityService.create('api::sms-log.sms-log' as any, {
                data: {
                    recipient: subscriber.phone,
                    recipientName: subscriber.firstName,
                    message,
                    status: result.success ? 'sent' : 'failed',
                    sentAt: result.success ? new Date().toISOString() : null,
                    errorMessage: result.error,
                    twilioSid: result.messageId,
                    notificationType: payload.priority === 'urgent' ? 'urgent' : 'important',
                    recipientType: 'all-subscribers',
                    relatedEntityId: payload.entityId,
                    relatedEntityType: payload.entityType,
                },
            });
        } catch (error) {
            this.strapi.log.error('SMS notification error:', error);
        }
    }

    private createSMSMessage(payload: NotificationPayload): string {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        switch (payload.type) {
            case 'new-post':
                return `New blog post published! Check it out: ${baseUrl}/blog/${payload.entityId}`;
            case 'new-service':
                return `New service available! Learn more: ${baseUrl}/services`;
            case 'booking':
                return `Your booking has been confirmed. View details: ${baseUrl}/bookings`;
            case 'order':
                return `Your order has been updated. View details: ${baseUrl}/orders`;
            default:
                return `You have a new notification from Dr Obinna Awiaka. Visit ${baseUrl} for details.`;
        }
    }

    private replaceTemplateVariables(template: string, data: Record<string, any>): string {
        let result = template;

        for (const [key, value] of Object.entries(data)) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            result = result.replace(regex, String(value || ''));
        }

        return result;
    }

    async queueNotification(payload: NotificationPayload, scheduledAt?: Date): Promise<void> {
        try {
            // Get all active subscribers
            const subscribers = await this.strapi.entityService.findMany('api::newsletter-subscriber.newsletter-subscriber', {
                filters: {
                    status: 'subscribed',
                },
            });

            if (!subscribers || !Array.isArray(subscribers) || subscribers.length === 0) {
                return;
            }

            // Get email template
            const template = await this.getEmailTemplate(payload.templateSlug || payload.type);
            if (!template) {
                this.strapi.log.error(`Email template not found for: ${payload.templateSlug || payload.type}`);
                return;
            }

            // Create notification queue entries for each subscriber
            for (const subscriber of subscribers) {
                const subscriberData = subscriber as any;
                await this.strapi.entityService.create('api::notification-queue.notification-queue' as any, {
                    data: {
                        subscriber: subscriberData.id,
                        email: subscriberData.email,
                        phone: subscriberData.phone,
                        notificationType: payload.type,
                        channel: payload.channel || 'email',
                        status: 'pending',
                        priority: payload.priority || 'normal',
                        scheduledAt: scheduledAt || new Date(),
                        emailTemplate: template.id,
                        templateData: payload.templateData,
                        relatedEntityId: payload.entityId,
                        relatedEntityType: payload.entityType,
                    } as any,
                });
            }

            this.strapi.log.info(`Queued ${subscribers.length} notifications for ${payload.type}`);
        } catch (error) {
            this.strapi.log.error('Queue notification error:', error);
        }
    }

    async processNotificationQueue(): Promise<void> {
        try {
            const now = new Date();

            // Get pending notifications that are scheduled to be sent
            const pendingNotifications = await this.strapi.entityService.findMany('api::notification-queue.notification-queue' as any, {
                filters: {
                    status: 'pending',
                    scheduledAt: {
                        $lte: now,
                    },
                },
                populate: ['subscriber', 'emailTemplate'],
            });

            if (!pendingNotifications || !Array.isArray(pendingNotifications) || pendingNotifications.length === 0) {
                return;
            }

            this.strapi.log.info(`Processing ${pendingNotifications.length} queued notifications`);

            for (const notification of pendingNotifications) {
                try {
                    const notificationData = notification as any;

                    // Update status to processing
                    await this.strapi.entityService.update('api::notification-queue.notification-queue', notificationData.id, {
                        data: { status: 'processing' } as any,
                    });

                    const subscriber = notificationData.subscriber;
                    const template = notificationData.emailTemplate;

                    // Send email
                    if (notificationData.channel === 'email' || notificationData.channel === 'both') {
                        const templateData = {
                            ...(notificationData.templateData || {}),
                            subscriberName: subscriber?.firstName || 'Valued Subscriber',
                            subscriberEmail: subscriber?.email || notificationData.email,
                            unsubscribeUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(subscriber?.email || notificationData.email)}`,
                        };

                        const subject = this.replaceTemplateVariables(template?.subject || '', templateData);
                        const htmlBody = this.replaceTemplateVariables(template?.htmlBody || '', templateData);

                        const result = await emailService.sendEmail({
                            to: subscriber?.email || notificationData.email,
                            subject,
                            html: htmlBody,
                            from: template?.fromEmail,
                            fromName: template?.fromName,
                        });

                        // Create email log
                        const emailLog = await this.strapi.entityService.create('api::email-log.email-log' as any, {
                            data: {
                                recipient: subscriber?.email || notificationData.email,
                                recipientName: subscriber?.firstName,
                                subject,
                                template: template?.id,
                                status: result.success ? 'sent' : 'failed',
                                sentAt: result.success ? new Date() : null,
                                errorMessage: result.error,
                                notificationType: notificationData.notificationType,
                                recipientType: 'all-subscribers',
                                relatedEntityId: notificationData.relatedEntityId,
                                relatedEntityType: notificationData.relatedEntityType,
                            } as any,
                        });

                        // Update notification with email log
                        await this.strapi.entityService.update('api::notification-queue.notification-queue', notificationData.id, {
                            data: { emailLog: emailLog.id } as any,
                        });
                    }

                    // Send SMS if configured and phone available
                    if ((notificationData.channel === 'sms' || notificationData.channel === 'both') && subscriber?.phone) {
                        const smsMessage = this.createSMSMessage({
                            type: notificationData.notificationType,
                            entityId: notificationData.relatedEntityId,
                            entityType: notificationData.relatedEntityType,
                        });

                        const smsResult = await smsService.sendSMS({
                            to: subscriber.phone,
                            message: smsMessage,
                        });

                        // Create SMS log
                        const smsLog = await this.strapi.entityService.create('api::sms-log.sms-log' as any, {
                            data: {
                                recipient: subscriber.phone,
                                recipientName: subscriber.firstName,
                                message: smsMessage,
                                status: smsResult.success ? 'sent' : 'failed',
                                sentAt: smsResult.success ? new Date() : null,
                                errorMessage: smsResult.error,
                                twilioSid: smsResult.messageId,
                                notificationType: notificationData.priority === 'urgent' ? 'urgent' : 'important',
                                recipientType: 'all-subscribers',
                                relatedEntityId: notificationData.relatedEntityId,
                                relatedEntityType: notificationData.relatedEntityType,
                            } as any,
                        });

                        // Update notification with SMS log
                        await this.strapi.entityService.update('api::notification-queue.notification-queue', notificationData.id, {
                            data: { smsLog: smsLog.id } as any,
                        });
                    }

                    // Mark notification as sent
                    await this.strapi.entityService.update('api::notification-queue.notification-queue', notificationData.id, {
                        data: {
                            status: 'sent',
                            sentAt: new Date(),
                        } as any,
                    });
                } catch (error) {
                    this.strapi.log.error(`Failed to process notification ${(notification as any).id}:`, error);

                    // Update retry count and status
                    const notificationData = notification as any;
                    const retryCount = (notificationData.retryCount || 0) + 1;
                    const maxRetries = notificationData.maxRetries || 3;

                    await this.strapi.entityService.update('api::notification-queue.notification-queue', notificationData.id, {
                        data: {
                            status: retryCount >= maxRetries ? 'failed' : 'pending',
                            retryCount,
                            errorMessage: error instanceof Error ? error.message : 'Unknown error',
                        } as any,
                    });
                }
            }
        } catch (error) {
            this.strapi.log.error('Process notification queue error:', error);
        }
    }
}

export default ({ strapi }: { strapi: Core.Strapi }) => {
    return new NotificationService(strapi);
};
