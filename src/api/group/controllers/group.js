'use strict';

/**
 * group controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const { deleteGroups } = require('../helpers/helpers');

module.exports = createCoreController('api::group.group',
    ({ strapi }) => ({
        async createGroups(ctx) {
            // @ts-ignore

            const { activityId, groups } = ctx.request.body;
            if (!activityId || !groups) {
                return ctx.badRequest({ result: 'Activity id and groups are required' });
            }
            try {

                await deleteGroups({ strapi, activityId });

                groups.forEach(async (group) => {
                    const create_group = await strapi.db.query("api::group.group").create({
                        data: {
                            users: group.map(user => user.id),
                            publishedAt: new Date(),
                            activity: activityId
                        },
                    });
                });
                return ctx.created({ result: 'Groups created' });
            }
            catch (err) {
                await deleteGroups({ strapi, activityId });
                return ctx.internalServerError({ result: 'Error creating groups' });
            }

        }
    }));