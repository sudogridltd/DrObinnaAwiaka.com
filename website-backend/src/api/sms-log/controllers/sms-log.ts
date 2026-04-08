/**
 * sms-log controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::sms-log.sms-log' as any, ({ strapi }: any) => ({
    // Custom method for bulk SMS sending
    async sendBulk(ctx: any) {
        try {
            const { data } = ctx.request.body;
            const { recipientType, recipients, subscribers, message, notificationType, ...smsData } = data;

            if (!recipientType) {
                return ctx.badRequest('Recipient type is required');
            }

            if (!message) {
                return ctx.badRequest('Message is required');
            }

            const results: any[] = [];
            const errors: any[] = [];

            // Handle different recipient types
            switch (recipientType) {
                case 'all-subscribers': {
                    // Send to all subscribed newsletter subscribers with phone numbers
                    const allSubscribers = await strapi.db.query('api::newsletter-subscriber.newsletter-subscriber').findMany({
                        where: {
                            status: 'subscribed',
                            phone: { $not: null }
                        },
                    });

                    for (const subscriber of allSubscribers) {
                        try {
                            if (subscriber.phone) {
                                const smsLog = await strapi.db.query('api::sms-log.sms-log').create({
                                    data: {
                                        recipient: subscriber.phone,
                                        recipientName: `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim(),
                                        message,
                                        notificationType: notificationType || 'important',
                                        recipientType: 'all-subscribers',
                                        isBulkSms: true,
                                        status: 'pending',
                                        ...smsData,
                                    },
                                });

                                // Connect to subscriber
                                await strapi.db.query('api::sms-log.sms-log').update({
                                    where: { id: smsLog.id },
                                    data: {
                                        subscribers: { connect: [subscriber.id] },
                                    },
                                });

                                results.push({ subscriberId: subscriber.id, phone: subscriber.phone, status: 'queued' });
                            }
                        } catch (error: any) {
                            errors.push({ subscriberId: subscriber.id, error: error.message });
                        }
                    }
                    break;
                }

                case 'all-customers': {
                    // Send to all customers with phone numbers
                    const allCustomers = await strapi.db.query('api::customer.customer').findMany({
                        where: { phone: { $not: null } },
                    });

                    for (const customer of allCustomers) {
                        try {
                            if (customer.phone) {
                                const smsLog = await strapi.db.query('api::sms-log.sms-log').create({
                                    data: {
                                        recipient: customer.phone,
                                        recipientName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
                                        message,
                                        notificationType: notificationType || 'important',
                                        recipientType: 'all-customers',
                                        isBulkSms: true,
                                        status: 'pending',
                                        ...smsData,
                                    },
                                });

                                // Connect to customer
                                await strapi.db.query('api::sms-log.sms-log').update({
                                    where: { id: smsLog.id },
                                    data: {
                                        recipients: { connect: [customer.id] },
                                    },
                                });

                                results.push({ customerId: customer.id, phone: customer.phone, status: 'queued' });
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

                                if (customer?.phone) {
                                    const smsLog = await strapi.db.query('api::sms-log.sms-log').create({
                                        data: {
                                            recipient: customer.phone,
                                            recipientName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
                                            message,
                                            notificationType: notificationType || 'important',
                                            recipientType: 'individual',
                                            isBulkSms: recipients.length > 1 || subscribers?.length > 0,
                                            status: 'pending',
                                            ...smsData,
                                        },
                                    });

                                    // Connect to customer
                                    await strapi.db.query('api::sms-log.sms-log').update({
                                        where: { id: smsLog.id },
                                        data: {
                                            recipients: { connect: [customerId] },
                                        },
                                    });

                                    results.push({ customerId, phone: customer.phone, status: 'queued' });
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

                                if (subscriber?.phone && subscriber.status === 'subscribed') {
                                    const smsLog = await strapi.db.query('api::sms-log.sms-log').create({
                                        data: {
                                            recipient: subscriber.phone,
                                            recipientName: `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim(),
                                            message,
                                            notificationType: notificationType || 'important',
                                            recipientType: 'individual',
                                            isBulkSms: subscribers.length > 1 || recipients?.length > 0,
                                            status: 'pending',
                                            ...smsData,
                                        },
                                    });

                                    // Connect to subscriber
                                    await strapi.db.query('api::sms-log.sms-log').update({
                                        where: { id: smsLog.id },
                                        data: {
                                            subscribers: { connect: [subscriberId] },
                                        },
                                    });

                                    results.push({ subscriberId, phone: subscriber.phone, status: 'queued' });
                                }
                            } catch (error: any) {
                                errors.push({ subscriberId, error: error.message });
                            }
                        }
                    }
                    break;
                }

                case 'custom': {
                    // Send to custom phone number
                    if (!smsData.recipient) {
                        return ctx.badRequest('Recipient phone is required for custom type');
                    }

                    const smsLog = await strapi.db.query('api::sms-log.sms-log').create({
                        data: {
                            recipient: smsData.recipient,
                            recipientName: smsData.recipientName || '',
                            message,
                            notificationType: notificationType || 'important',
                            recipientType: 'custom',
                            isBulkSms: false,
                            status: 'pending',
                            ...smsData,
                        },
                    });

                    results.push({ phone: smsData.recipient, status: 'queued' });
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
