/**
 * Booking Submission Lifecycle Hooks
 * Triggers notifications when booking status changes
 */

export default {
    async afterCreate(event: any) {
        const { result } = event;

        // Notify customer when booking is created
        try {
            const notificationService = strapi.service('api::notification.notification');

            if (notificationService && result.email) {
                await notificationService.notifySubscribers({
                    type: 'booking',
                    entityId: result.id.toString(),
                    entityType: 'booking-submission',
                    templateSlug: 'booking-confirmation',
                    templateData: {
                        customerName: result.name || 'Valued Customer',
                        bookingReference: result.reference || result.id.toString(),
                        serviceName: result.service || 'Consultation',
                        bookingDate: result.date ? new Date(result.date).toLocaleDateString() : 'TBD',
                        bookingTime: result.time || 'TBD',
                        bookingAmount: result.amount ? `$${result.amount}` : 'Contact for pricing',
                        bookingUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings/${result.id}`,
                    },
                    priority: 'high',
                    channel: 'email',
                });

                strapi.log.info(`Booking confirmation sent for booking: ${result.reference || result.id}`);
            }
        } catch (error) {
            strapi.log.error('Failed to send booking confirmation:', error);
        }
    },

    async afterUpdate(event: any) {
        const { result, params } = event;

        // Notify customer on booking status changes
        try {
            const notificationService = strapi.service('api::notification.notification');

            if (!notificationService || !result.email) {
                return;
            }

            // Check if status changed
            const statusChanged = params.data.status && params.data.status !== result.status;

            if (statusChanged) {
                let priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal';
                let message = '';

                // Determine notification based on status
                if (result.status === 'confirmed') {
                    message = 'Your booking has been confirmed!';
                    priority = 'high';
                } else if (result.status === 'cancelled') {
                    message = 'Your booking has been cancelled.';
                    priority = 'urgent';
                } else if (result.status === 'completed') {
                    message = 'Your booking has been completed. Thank you!';
                    priority = 'high';
                } else if (result.status === 'rescheduled') {
                    message = 'Your booking has been rescheduled.';
                    priority = 'high';
                }

                if (message) {
                    await notificationService.notifySubscribers({
                        type: 'booking',
                        entityId: result.id.toString(),
                        entityType: 'booking-submission',
                        templateSlug: 'booking-confirmation',
                        templateData: {
                            customerName: result.name || 'Valued Customer',
                            bookingReference: result.reference || result.id.toString(),
                            serviceName: result.service || 'Consultation',
                            bookingDate: result.date ? new Date(result.date).toLocaleDateString() : 'TBD',
                            bookingTime: result.time || 'TBD',
                            bookingAmount: result.amount ? `$${result.amount}` : 'Contact for pricing',
                            bookingStatus: result.status || 'Pending',
                            statusMessage: message,
                            bookingUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings/${result.id}`,
                        },
                        priority,
                        channel: priority === 'urgent' ? 'both' : 'email',
                    });

                    strapi.log.info(`Booking status notification sent for booking: ${result.reference || result.id} - Status: ${result.status}`);
                }
            }
        } catch (error) {
            strapi.log.error('Failed to send booking status notification:', error);
        }
    },
};
