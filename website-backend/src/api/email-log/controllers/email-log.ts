/**
 * email-log controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::email-log.email-log' as any, ({ strapi }: any) => ({
    // Custom method for bulk email sending
    async sendBulk(ctx: any) {
        try {
            const { data } = ctx.request.body;
            const { recipientType, recipients, subscribers, subject, template, notificationType, ...emailData } = data;

            if (!recipientType) {
                return ctx.badRequest('Recipient type is required');
            }

            if (!subject || !template) {
                return ctx.badRequest('Subject and template are required');
            }

            const results: any[] = [];
            const errors: any[] = [];

            // Handle different recipient types
            switch (recipientType) {
                case 'all-subscribers': {
                    // Send to all subscribed newsletter subscribers
                    const allSubscribers = await strapi.db.query('api::newsletter-subscriber.newsletter-subscriber').findMany({
                        where: { status: 'subscribed' },
                    });

                    for (const subscriber of allSubscribers) {
                        try {
                            if (subscriber.email) {
                                const emailLog = await strapi.db.query('api::email-log.email-log').create({
                                    data: {
                                        recipient: subscriber.email,
                                        recipientName: `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim(),
                                        subject,
                                        template,
                                        notificationType: notificationType || 'custom',
                                        recipientType: 'all-subscribers',
                                        isBulkEmail: true,
                                        status: 'pending',
                                        ...emailData,
                                    },
                                });

                                // Connect to subscriber
                                await strapi.db.query('api::email-log.email-log').update({
                                    where: { id: emailLog.id },
                                    data: {
                                        subscribers: { connect: [subscriber.id] },
                                    },
                                });

                                results.push({ subscriberId: subscriber.id, email: subscriber.email, status: 'queued' });
                            }
                        } catch (error: any) {
                            errors.push({ subscriberId: subscriber.id, error: error.message });
                        }
                    }
                    break;
                }

                case 'all-customers': {
                    // Send to all customers
                    const allCustomers = await strapi.db.query('api::customer.customer').findMany();

                    for (const customer of allCustomers) {
                        try {
                            if (customer.email) {
                                const emailLog = await strapi.db.query('api::email-log.email-log').create({
                                    data: {
                                        recipient: customer.email,
                                        recipientName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
                                        subject,
                                        template,
                                        notificationType: notificationType || 'custom',
                                        recipientType: 'all-customers',
                                        isBulkEmail: true,
                                        status: 'pending',
                                        ...emailData,
                                    },
                                });

                                // Connect to customer
                                await strapi.db.query('api::email-log.email-log').update({
                                    where: { id: emailLog.id },
                                    data: {
                                        recipients: { connect: [customer.id] },
                                    },
                                });

                                results.push({ customerId: customer.id, email: customer.email, status: 'queued' });
                            }
                        } catch (error: any) {
                            errors.push({ customerId: customer.id, error: error.message });
                        }
                    }
                    break;
                }

                case 'individual': {
                    // Send to specific customers and/or subscribers
                    if (!recipients?.length && !subscribers?.length) {
                        return ctx.badRequest('At least one recipient or subscriber is required for individual type');
                    }

                    // Send to selected customers
                    if (recipients?.length) {
                        for (const customerId of recipients) {
                            try {
                                const customer = await strapi.db.query('api::customer.customer').findOne({
                                    where: { id: customerId },
                                });

                                if (customer?.email) {
                                    const emailLog = await strapi.db.query('api::email-log.email-log').create({
                                        data: {
                                            recipient: customer.email,
                                            recipientName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
                                            subject,
                                            template,
                                            notificationType: notificationType || 'custom',
                                            recipientType: 'individual',
                                            isBulkEmail: recipients.length > 1 || subscribers?.length > 0,
                                            status: 'pending',
                                            ...emailData,
                                        },
                                    });

                                    // Connect to customer
                                    await strapi.db.query('api::email-log.email-log').update({
                                        where: { id: emailLog.id },
                                        data: {
                                            recipients: { connect: [customerId] },
                                        },
                                    });

                                    results.push({ customerId, email: customer.email, status: 'queued' });
                                }
                            } catch (error: any) {
                                errors.push({ customerId, error: error.message });
                            }
                        }
                    }

                    // Send to selected subscribers
                    if (subscribers?.length) {
                        for (const subscriberId of subscribers) {
                            try {
                                const subscriber = await strapi.db.query('api::newsletter-subscriber.newsletter-subscriber').findOne({
                                    where: { id: subscriberId },
                                });

                                if (subscriber?.email && subscriber.status === 'subscribed') {
                                    const emailLog = await strapi.db.query('api::email-log.email-log').create({
                                        data: {
                                            recipient: subscriber.email,
                                            recipientName: `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim(),
                                            subject,
                                            template,
                                            notificationType: notificationType || 'custom',
                                            recipientType: 'individual',
                                            isBulkEmail: subscribers.length > 1 || recipients?.length > 0,
                                            status: 'pending',
                                            ...emailData,
                                        },
                                    });

                                    // Connect to subscriber
                                    await strapi.db.query('api::email-log.email-log').update({
                                        where: { id: emailLog.id },
                                        data: {
                                            subscribers: { connect: [subscriberId] },
                                        },
                                    });

                                    results.push({ subscriberId, email: subscriber.email, status: 'queued' });
                                }
                            } catch (error: any) {
                                errors.push({ subscriberId, error: error.message });
                            }
                        }
                    }
                    break;
                }

                case 'custom': {
                    // Send to custom email address
                    if (!emailData.recipient) {
                        return ctx.badRequest('Recipient email is required for custom type');
                    }

                    const emailLog = await strapi.db.query('api::email-log.email-log').create({
                        data: {
                            recipient: emailData.recipient,
                            recipientName: emailData.recipientName || '',
                            subject,
                            template,
                            notificationType: notificationType || 'custom',
                            recipientType: 'custom',
                            isBulkEmail: false,
                            status: 'pending',
                            ...emailData,
                        },
                    });

                    results.push({ email: emailData.recipient, status: 'queued' });
                    break;
                }

                default:
                    return ctx.badRequest('Invalid recipient type');
            }

            return {
                data: {
                    recipientType,
                    totalQueued: results.length,
                    totalErrors: errors.length,
                    results,
                    errors,
                },
            };
        } catch (error: any) {
            return ctx.badRequest(error.message);
        }
    },
}));
