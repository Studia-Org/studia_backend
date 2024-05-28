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

        },
        async createUsers(ctx) {
            const { users } = ctx.request.body;
            const usersCreated = [];
            const seenEmails = new Set();
            const seenUsernames = new Set();
            const seenNames = new Set();

            try {
                if (!users) {
                    throw new Error('Users are required');
                }

                for (const user of users) {
                    if (!user.username || !user.name || !user.email || !user.password || user.isTeacher == undefined || !user.description || !user.university) {
                        throw new Error("User data must contain username, name, email, password, isTeacher, description, and university");
                    }

                    if (seenEmails.has(user.email) || seenUsernames.has(user.username) || seenNames.has(user.name)) {
                        throw new Error(`User already created, duplicated: ${user.email || user.username || user.name}`);
                    }

                    seenEmails.add(user.email);
                    seenUsernames.add(user.username);
                    seenNames.add(user.name);

                    const userCreated = await strapi.entityService.create('plugin::users-permissions.user', {
                        data: {
                            ...user,
                            profile_photo: user.profile_photo ? user.profile_photo : 2,//431 dev,
                            role: user.isTeacher ? 4 : 3,//cambiar a 19 dev
                            role_str: user.isTeacher ? 'professor' : 'student',
                            provider: 'local'
                        }
                    });
                    usersCreated.push(userCreated);
                }


                ctx.response.status = 200;
                return ctx
            }
            catch (error) {
                //delete users created
                await Promise.all(
                    usersCreated.map(async (user) => {
                        const delete_group = await strapi.db.query("plugin::users-permissions.user").delete({
                            where: {
                                id: user.id
                            }
                        });
                    })
                )
                // @ts-ignore
                return ctx.badRequest('Error creating users', {
                    error: error.message
                })
            }

        }
    }));