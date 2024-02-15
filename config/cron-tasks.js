const { crearActividadVinculandoUsuarios, hacerGrupos } = require('../config/functionsPeerReview/helpers');


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
                console.log(new Date());
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
                            usersToPair: subsection?.activity?.usersToPair,
                        }
                    }
                    catch (err) {
                        console.log("Subsection without activity/taskToReview: subsection.id: ", subsection.id);
                    }
                })

                subsections = subsections.filter(subsection => subsection !== undefined);

                subsections.forEach(
                    async subsection => {
                        try {
                            // call to create activity
                            console.log("Creating activity for subsection: ", subsection);
                            // @ts-ignore
                            const { parejas, error } = await crearActividadVinculandoUsuarios({ request: { body: subsection } });
                            if (error) throw new Error(error);
                            console.log(`Activity created with : ${parejas.length} pairs}`);

                        }
                        catch (err) {
                            console.error(err.message);
                            console.log("#############################################################################################################");

                        }
                    })
                console.log("#############################################################################################################");

            }

            catch (err) {

                console.error(err.message);
                console.log("#############################################################################################################");

            }


        },
        options: {
            rule: '0 0 0 * * *', // cada dia a las 00:00:00
            tz: 'Europe/Madrid'
        }
    },
    '*/1 * * * *': {
        task: async ({ strapi }) => {

            const activitiesToMakeGroups = await strapi.entityService.findMany('api::activity.activity', {
                filters: {
                    groupActivity: true,
                    start_date: {
                        $lte: new Date()
                    },
                    deadline: {
                        $gte: new Date()
                    }
                }
            });


            const groups = await strapi.entityService.findMany('api::group.group', {
                filters: {
                    activity: {
                        id: activitiesToMakeGroups.map(activity => activity.id)
                    }
                },
                populate: {
                    activity: true,
                    users: true
                }
            });

            const subsections = await strapi.entityService.findMany('api::subsection.subsection', {
                filters: {
                    activity: {
                        id: activitiesToMakeGroups.map(activity => activity.id)
                    }
                },
                populate: {
                    activity: true,
                    section: {
                        populate: {
                            course: {
                                populate: {
                                    students: true
                                }
                            }
                        }
                    }
                }
            })


            const activitiesPerCourse = subsections.reduce((acc, subsection) => {
                const course = subsection.section.course.id;
                const groupsCourse = groups.filter(group => group.activity.id === subsection.activity.id);

                if (acc[course]) {
                    acc[course].push({
                        activity: subsection.activity,
                        subsection: subsection,
                        students: subsection.section.course.students,
                        groups: groupsCourse
                    });

                } else {
                    acc[course] = [{
                        activity: subsection.activity,
                        subsection: subsection,
                        students: subsection.section.course.students,
                        groups: groupsCourse
                    }];
                }
                // add groups

                return acc;
            }, {});
            try {

                for (const key in activitiesPerCourse) {
                    const course = activitiesPerCourse[key];
                    course.forEach(async subsection => {
                        const { students, groups: groupsCourse } = subsection;
                        const longitudGrupo = subsection.activity.numberOfStudentsperGroup;

                        const allStudentsHasGroup = groupsCourse.every((group) => {
                            return group.users.every((user) => {
                                return students.some((student) => {
                                    return student.id === user.id
                                        && group.activity.id === subsection.activity.id;
                                });
                            });
                        }) && groupsCourse.length > 0;
                        console.log("All students has group: " + subsection.activity.id, allStudentsHasGroup);
                        if (allStudentsHasGroup) return;
                        //delete all groups from this activity
                        await strapi.entityService.deleteMany('api::group.group', {
                            activity: subsection.activity.id
                        });
                        console.log("Creating groups for activity: ", subsection.activity.id);
                        const { grupos } = await hacerGrupos(students, longitudGrupo);

                        for (const pareja of grupos) {
                            const group = await strapi.entityService.create('api::group.group', {
                                data: {
                                    activity: subsection.activity.id,
                                    users: pareja.map(user => user.id),
                                    publishedAt: new Date(),
                                },
                            });
                        }
                    });

                };
            }
            catch (err) {
                console.error(err.message);
            }
        },
        options: {
            tz: 'Europe/Madrid'
        }
    }
}