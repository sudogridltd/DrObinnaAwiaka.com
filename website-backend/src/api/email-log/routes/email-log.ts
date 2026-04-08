/**
 * email-log router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::email-log.email-log' as any, {
    config: {
        sendBulk: {
            auth: {
                scope: ['api::email-log.email-log.sendBulk'],
            },
            policies: [],
            middlewares: [],
        },
    },
});
