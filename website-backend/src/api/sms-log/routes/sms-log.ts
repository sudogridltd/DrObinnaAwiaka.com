/**
 * sms-log router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::sms-log.sms-log' as any, {
    config: {
        sendBulk: {
            auth: {
                scope: ['api::sms-log.sms-log.sendBulk'],
            },
            policies: [],
            middlewares: [],
        },
    },
});
