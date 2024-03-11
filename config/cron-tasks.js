const { crearActividadVinculandoUsuarios, hacerGrupos } = require('../config/functionsPeerReview/helpers');
const { deleteGroups } = require('../src/api/group/helpers/helpers');
const subsection = require('../src/api/subsection/controllers/subsection');


module.exports = {
    nuevaCronTask: {
        task: async ({ strapi }) => {
            try {
                const today = new Date();
                let subsections =
                    await strapi.entityService.findMany('api::subsection.subsection',
                        {
                            populate: {
                                activity: true,
                                section: {
                                    populate: {
                                        course: {
                                            populate: {
                                                students: {
                                                    populate: {
                                                        subsections_completed: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            filters: {
                                end_date: {
                                    $lt: today
                                },
                                activity: {
                                    evaluable: false
                                },
                                section: {
                                    course: {
                                        start_date: {
                                            $lte: today
                                        },
                                        end_date: {
                                            $gte: today
                                        }
                                    }
                                },
                            }
                        }
                    )

                subsections.forEach(async subsection => {
                    const students = subsection.section.course.students;
                    try {
                        students.forEach(async student => {
                            const subsectionsCompleted = student.subsections_completed;
                            const alreadyCompleted = subsectionsCompleted.some(subsectionCompleted => subsectionCompleted.id === subsection.id);
                            if (!alreadyCompleted) {
                                await strapi.entityService.update('plugin::users-permissions.user', student.id, {
                                    data: {
                                        subsections_completed: {
                                            connect: [subsection.id]
                                        }
                                    }
                                });

                            }
                        })
                    } catch (error) {
                        console.error("Error en la nueva tarea cron:", error);
                    }
                })

            } catch (error) {
                console.error("Error en la nueva tarea cron:", error);
            }
        },
        options: {
            // cada diez minutos
            rule: '*/10 * * * *',
            tz: 'Europe/Madrid'
        }
    },
    postPeerReview: {
        task: async ({ strapi }) => {
            try {

                let subsections =
                    await strapi.entityService.findMany('api::subsection.subsection',
                        {
                            populate: {
                                activity: {
                                    populate: {
                                        task_to_review: true,
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
                                    start_date: {
                                        $lte: new Date()
                                    },
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

                subsections = subsections.filter(subsection => subsection.activity.qualifications.length === 0);
                console.log("Activities after filtering the ones who has alreay created qualifications: ", subsections.length);

                subsections = subsections.map(subsection => {
                    console.log("Subsection: ", subsection.id);
                    try {

                        return {
                            idCourse: subsection?.section?.course?.id,
                            idMainActivity: subsection?.activity?.task_to_review?.id,
                            reviewInGroups: subsection?.activity?.groupActivity,
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
                            // @ts-ignore
                            const { parejas, error } = await crearActividadVinculandoUsuarios({ request: { body: subsection } });
                            if (error) throw new Error(error);
                        }
                        catch (err) {
                            console.error(err.message);
                        }
                    })
                console.log("#############################################################################################################");

            }

            catch (err) {

                console.error(err.message);
                console.log("#############################################################################################################");

            }
            finally {
                console.log("Done creating peer review activities")
            }


        },
        options: {
            // rule: '0 0 0 * * *', // cada dia a las 00:00:00
            rule: '*/1 * * * *', // cada minuto
            tz: 'Europe/Madrid'
        }
    },
    '*/1 * * * *': {
        task: async ({ strapi }) => {
            console.log("Running cron job to create groups");
            const activitiesToMakeGroups = await strapi.entityService.findMany('api::activity.activity', {
                filters: {
                    groupActivity: true,
                    $not: {
                        type: 'peerReview'
                    },
                    start_date: {
                        $lte: new Date()
                    },
                    deadline: {
                        $gte: new Date()
                    }
                }
            });
            console.log("Activities to make groups: ", activitiesToMakeGroups.length);

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

                        await deleteGroups({ strapi, activityId: subsection.activity.id });

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
                        console.log("Created groups for activity: ", subsection.activity.id);
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
    },

}