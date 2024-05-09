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
                const groupsWithQualifcationToReview = {}
                const usersWithQualificationToReview = {}
                const activityId = peers[0].activity
                peers.map(async (peer) => {
                    if (peerInGroups) {
                        peer.groups.forEach((group) => {
                            if (groupsWithQualifcationToReview[group]) {
                                groupsWithQualifcationToReview[group].push(peer.qualifications)
                            }
                            else {
                                groupsWithQualifcationToReview[group] = [peer.qualifications]
                            }
                        })
                        await Object.entries(groupsWithQualifcationToReview).forEach(async ([group, qualifications]) => {
                            const create_peer = await strapi.db.query("api::qualification.qualification").create({
                                data: {
                                    group: [group],
                                    activity: activityId,
                                    peer_review_qualifications: qualifications,
                                    publishedAt: new Date(),
                                },
                            });
                        })
                    }
                    else {
                        peer.users.forEach(async (user) => {
                            if (usersWithQualificationToReview[user]) {
                                usersWithQualificationToReview[user].push(peer.qualifications)
                            }
                            else {
                                usersWithQualificationToReview[user] = [peer.qualifications]
                            }
                        })
                        await Object.entries(usersWithQualificationToReview).forEach(async ([user, qualifications]) => {
                            createdPeers.push(user)
                            const create_peer = await strapi.db.query("api::qualification.qualification").create({
                                data: {
                                    user: [user],
                                    activity: activityId,
                                    peer_review_qualifications: qualifications,
                                    publishedAt: new Date(),
                                },
                            });
                        })
                    }
                })


                // await peers.forEach(async (peer) => {
                //     try {
                //         if (peerInGroups) {
                //             peer.groups.forEach(async (group) => {
                //                 const create_peer = await strapi.db.query("api::qualification.qualification").create({
                //                     data: {
                //                         group: [group],
                //                         activity: peer.activity,
                //                         peer_review_qualifications: peer.qualifications,
                //                         publishedAt: new Date(),
                //                     },
                //                 });
                //             });
                //         }
                //         else {
                //             peer.users.forEach(async (user) => {
                //                 createdPeers.push(user)
                //                 const create_peer = await strapi.db.query("api::qualification.qualification").create({
                //                     data: {
                //                         user: [user],
                //                         activity: peer.activity,
                //                         peer_review_qualifications: peer.qualifications,
                //                         publishedAt: new Date(),
                //                     },
                //                 });
                //             });
                //         }

                //     } catch (err) {
                //         console.log(err)
                //     }
                // });

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


