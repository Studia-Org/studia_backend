'use strict';

/**
 * qualification controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::qualification.qualification',
    ({ strapi }) => ({
        async createPeers(ctx) {
            // @ts-ignore

            const { peers } = ctx.request.body;
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

                peers.forEach(async (peer) => {
                    try {
                        peer.users.forEach(async (user) => {

                            const create_peer = await strapi.db.query("api::qualification.qualification").create({
                                data: {
                                    user: [user],
                                    activity: peer.activity,
                                    peer_review_qualifications: peer.qualifications,
                                    publishedAt: new Date(),
                                },
                            });
                        });


                    } catch (err) {
                        console.log(err)
                    }
                });
                ctx.response.status = 200;
                return ctx
            }
            catch (err) {
                console.log(err)
                return ctx.internalServerError({ result: err.message });
            }

        }

    }));


