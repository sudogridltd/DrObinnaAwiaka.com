/**
 * Service Lifecycle Hooks
 * Triggers notifications when new services are added
 */

export default {
    async afterCreate(event: any) {
        const { result } = event;

        // Only notify when service is published
        if (result.publishedAt) {
            try {
                const notificationService = strapi.service('api::notification.notification');

                if (notificationService) {
                    await notificationService.notifySubscribers({
                        type: 'new-service',
                        entityId: result.id.toString(),
                        entityType: 'service',
                        templateSlug: 'new-service',
                        templateData: {
                            serviceName: result.name,
                            serviceDescription: result.description || '',
                            servicePrice: result.price ? `$${result.price}` : 'Contact for pricing',
                            serviceUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/services`,
                            serviceImage: result.image?.url || '',
                            serviceCategory: result.category || '',
                        },
                        priority: 'normal',
                        channel: 'email',
                    });

                    strapi.log.info(`Notifications sent for new service: ${result.name}`);
                }
            } catch (error) {
                strapi.log.error('Failed to send service notifications:', error);
            }
        }
    },

    async afterUpdate(event: any) {
        const { result, params } = event;

        // Check if service was just published (was draft, now published)
        const wasPublished = params.data.publishedAt && !params.data.publishedAt;
        const isNowPublished = result.publishedAt;

        if (wasPublished && isNowPublished) {
            try {
                const notificationService = strapi.service('api::notification.notification');

                if (notificationService) {
                    await notificationService.notifySubscribers({
                        type: 'new-service',
                        entityId: result.id.toString(),
                        entityType: 'service',
                        templateSlug: 'new-service',
                        templateData: {
                            serviceName: result.name,
                            serviceDescription: result.description || '',
                            servicePrice: result.price ? `$${result.price}` : 'Contact for pricing',
                            serviceUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/services`,
                            serviceImage: result.image?.url || '',
                            serviceCategory: result.category || '',
                        },
                        priority: 'normal',
                        channel: 'email',
                    });

                    strapi.log.info(`Notifications sent for published service: ${result.name}`);
                }
            } catch (error) {
                strapi.log.error('Failed to send service notifications:', error);
            }
        }
    },
};
