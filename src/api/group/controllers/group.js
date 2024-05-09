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
                const firstGroup = [...groups[0]]
                const lastElement = firstGroup.pop() // check if groups are already created and just need to be updated
                const groupId = lastElement.groupId;
                if (groupId) {
                    groups.forEach(async (group) => {
                        const lastElement = group.pop();
                        const id = lastElement.groupId;
                        if (id) {

                            const update_group = await strapi.db.query("api::group.group").update({
                                where: {
                                    id: id
                                },
                                data: {
                                    users: group.map(user => user.id),
                                    publishedAt: new Date(),
                                    activity: activityId
                                },
                            });
                        }
                        else {
                            group.push(lastElement);
                            const create_group = await strapi.db.query("api::group.group").create({
                                data: {
                                    users: group.map(user => user.id),
                                    publishedAt: new Date(),
                                    activity: activityId
                                },
                            });
                        }
                    });

                }
                else {
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
                }

                ctx.response.status = 200;
                return ctx
            }
            catch (err) {
                //await deleteGroups({ strapi, activityId, newGroups: groups });
                ctx.response.status = 500;
                return ctx.internalServerError({ result: 'Error creating groups' });
            }

        }
    }));