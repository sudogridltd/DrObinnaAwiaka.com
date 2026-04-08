/**
 * Blog Post Lifecycle Hooks
 * Triggers notifications when new posts are published
 */

export default {
    async afterCreate(event: any) {
        const { result } = event;

        // Only notify when post is published
        if (result.publishedAt) {
            try {
                const notificationService = strapi.service('api::notification.notification');

                if (notificationService) {
                    await notificationService.notifySubscribers({
                        type: 'new-post',
                        entityId: result.id.toString(),
                        entityType: 'blog-post',
                        templateSlug: 'new-post',
                        templateData: {
                            postTitle: result.title,
                            postExcerpt: result.excerpt || result.content?.substring(0, 150) + '...',
                            postUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/blog/${result.slug || result.id}`,
                            postImage: result.featuredImage?.url || '',
                            authorName: result.author || 'Dr Obinna Awiaka',
                            publishedDate: new Date(result.publishedAt).toLocaleDateString(),
                        },
                        priority: 'normal',
                        channel: 'email',
                    });

                    strapi.log.info(`Notifications sent for new blog post: ${result.title}`);
                }
            } catch (error) {
                strapi.log.error('Failed to send blog post notifications:', error);
            }
        }
    },

    async afterUpdate(event: any) {
        const { result, params } = event;

        // Check if post was just published (was draft, now published)
        const wasPublished = params.data.publishedAt && !params.data.publishedAt;
        const isNowPublished = result.publishedAt;

        if (wasPublished && isNowPublished) {
            try {
                const notificationService = strapi.service('api::notification.notification');

                if (notificationService) {
                    await notificationService.notifySubscribers({
                        type: 'new-post',
                        entityId: result.id.toString(),
                        entityType: 'blog-post',
                        templateSlug: 'new-post',
                        templateData: {
                            postTitle: result.title,
                            postExcerpt: result.excerpt || result.content?.substring(0, 150) + '...',
                            postUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/blog/${result.slug || result.id}`,
                            postImage: result.featuredImage?.url || '',
                            authorName: result.author || 'Dr Obinna Awiaka',
                            publishedDate: new Date(result.publishedAt).toLocaleDateString(),
                        },
                        priority: 'normal',
                        channel: 'email',
                    });

                    strapi.log.info(`Notifications sent for published blog post: ${result.title}`);
                }
            } catch (error) {
                strapi.log.error('Failed to send blog post notifications:', error);
            }
        }
    },
};
