const crearActividadVinculandoUsuarios = require('../config/functionsPeerReview/helpers');

module.exports = {
    postPeerReview: {
        task: async ({ strapi }) => {
            try {

                let subsections =
                    await strapi.entityService.findMany('api::subsection.subsection',
                        {
                            populate: {
                                activity: {
                                    populate: {
                                        taskToReview: true,
                                        qualifications: true,
                                    }
                                },
                                section: {
                                    populate: {
                                        course: true,
                                    }
                                }
                            },
                            filters: {
                                activity: {
                                    type: 'peerReview',
                                    deadline: {
                                        $gte: new Date()
                                    },
                                },
                                start_date: {
                                    $lte: new Date()
                                },


                            }
                        }
                    )
                console.log("#############################################################################################################");
                console.log("Activities: ", subsections.length);

                subsections = subsections.filter(subsection => subsection.activity.qualifications.length === 0);

                console.log("Activities after filtering the ones who has alreay created qualifications: ", subsections.length);

                subsections = subsections.map(subsection => {
                    try {

                        return {
                            idCourse: subsection?.section?.course?.id,
                            idMainActivity: subsection?.activity?.taskToReview?.id,
                            idActivityPeerReview: subsection?.activity?.id,
                            startDate: new Date(subsection?.start_date),
                        }
                    }
                    catch (err) {
                        console.log("Subsection without activity/taskToReview: subsection.id: ", subsection.id);
                    }
                })

                subsections = subsections.filter(subsection => subsection !== undefined);

                subsections.forEach(async subsection => {
                    try {
                        // call to create activity
                        console.log("Creating activity for subsection: ", subsection);
                        const { parejas } = await crearActividadVinculandoUsuarios({ request: { body: subsection } });
                        console.log(`Activity created with : ${parejas.length} pairs}`);

                    }
                    catch (err) {
                        console.log(err);
                    }
                })
                console.log("#############################################################################################################");

            }

            catch (err) {

                console.log(err);
                console.log("#############################################################################################################");

            }


        },
        options: {
            cron: '0 0 0 * * *', // cada dia a las 00:00:00
            tz: 'Europe/Madrid'
        }
    }
}