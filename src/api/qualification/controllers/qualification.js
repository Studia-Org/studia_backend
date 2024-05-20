'use strict';

/**
 * qualification controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::qualification.qualification',
    ({ strapi }) => ({
        async createPeers(ctx) {
            // @ts-ignore

            const { peers, peerInGroups, updatedBy } = ctx.request.body;
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
                        qualifications: {
                            populate: {
                                group: true
                            }
                        }
                    }
                })
                const qualificationsCreated = activity.qualifications.map((qualification) => qualification)

                const createdPeers = []
                const groupsWithQualifcationToReview = {}
                const usersWithQualificationToReview = {}
                const activityId = peers[0].activity

                peers.map((peer) => {
                    if (peerInGroups) {
                        peer.groups.forEach((group) => {
                            if (groupsWithQualifcationToReview[group]) {
                                groupsWithQualifcationToReview[group].push(peer.qualifications)
                            }
                            else {
                                groupsWithQualifcationToReview[group] = [peer.qualifications]
                            }
                        })

                    }
                    else {
                        peer.users.forEach((user) => {
                            if (usersWithQualificationToReview[user]) {
                                usersWithQualificationToReview[user].push(peer.qualifications)
                            }
                            else {
                                usersWithQualificationToReview[user] = [peer.qualifications]
                            }
                        })
                    }
                })

                if (peerInGroups) {
                    await Promise.all(
                        Object.entries(groupsWithQualifcationToReview).map(async ([group, qualifications]) => {
                            // if exist peer review qualification for this group update it
                            const peerReviewQualification = qualificationsCreated.find((qualification) => {
                                return +qualification.group?.id === +group
                            })
                            if (peerReviewQualification) {
                                const update_peer = await strapi.db.query("api::qualification.qualification").update({
                                    where: {
                                        id: peerReviewQualification.id
                                    },
                                    data: {
                                        peer_review_qualifications: qualifications,
                                        publishedAt: new Date(),
                                        evaluator: updatedBy,
                                    },
                                });
                                return update_peer;
                            }
                            else {
                                const create_peer = await strapi.db.query("api::qualification.qualification").create({
                                    data: {
                                        group: [group],
                                        activity: activityId,
                                        peer_review_qualifications: qualifications,
                                        publishedAt: new Date(),
                                        evaluator: updatedBy,
                                    },
                                });
                                return create_peer;
                            }
                        })
                    );
                }
                else {
                    await Promise.all(
                        Object.entries(usersWithQualificationToReview).map(async ([user, qualifications]) => {
                            createdPeers.push(user)
                            const create_peer = await strapi.db.query("api::qualification.qualification").create({
                                data: {
                                    user: [user],
                                    activity: activityId,
                                    peer_review_qualifications: qualifications,
                                    publishedAt: new Date(),
                                    evaluator: updatedBy,
                                },
                            });
                        })
                    )
                }

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


