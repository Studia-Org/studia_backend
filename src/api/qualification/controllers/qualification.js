'use strict';

/**
 * qualification controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::qualification.qualification',
    ({ strapi }) => ({
        async createPeers(ctx) {
            // @ts-ignore

            const { peers, peerInGroups } = ctx.request.body;
            if (!peers) {
                return ctx.badRequest({ result: 'Peers are required' });
            }
            try {
                //delete qualifications if they exist
                const activity = await strapi.db.query("api::activity.activity").findOne({
                    where: {
                        id: peers[0].activity
                    },
                    populate: {
                        qualifications: true
                    }
                })
                const qualifications = activity.qualifications.map((qualification) => qualification.id)

                await Promise.all(qualifications.map(async (qualificationID) => {
                    const delete_qualification = await strapi.db.query("api::qualification.qualification").delete({
                        where: {
                            id: qualificationID
                        }
                    });
                }));
                const createdPeers = []
                await peers.forEach(async (peer) => {
                    try {
                        if (peerInGroups) {
                            peer.groups.forEach(async (group) => {
                                const create_peer = await strapi.db.query("api::qualification.qualification").create({
                                    data: {
                                        group: [group],
                                        activity: peer.activity,
                                        peer_review_qualifications: peer.qualifications,
                                        publishedAt: new Date(),
                                    },
                                });
                            });
                        }
                        else {
                            peer.users.forEach(async (user) => {
                                createdPeers.push(user)
                                const create_peer = await strapi.db.query("api::qualification.qualification").create({
                                    data: {
                                        user: [user],
                                        activity: peer.activity,
                                        peer_review_qualifications: peer.qualifications,
                                        publishedAt: new Date(),
                                    },
                                });
                            });
                        }

                    } catch (err) {
                        console.log(err)
                    }
                });

                //check if peer_review_qualifications users has a qualification
                if (!peerInGroups) {
                    const qualifications = await strapi.db.query("api::qualification.qualification").findMany({
                        where: {
                            id: peers.map((peer) => peer.qualifications)
                        },
                        populate: {
                            user: true
                        }
                    });
                    const users = qualifications.map((qualification) => qualification.user.id)
                    const usersWithoutQualification = users.filter((user) => !createdPeers.includes(user))

                    for (const user of usersWithoutQualification) {
                        const create_peer = await strapi.db.query("api::qualification.qualification").create({
                            data: {
                                user: [user],
                                activity: peers[0].activity,
                                publishedAt: new Date(),
                            },
                        });
                    }
                }

                ctx.response.status = 200;
                return ctx
            }
            catch (err) {
                console.log(err)
                return ctx.internalServerError({ result: err.message });
            }

        }

    }));


