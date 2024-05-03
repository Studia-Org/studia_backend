
module.exports = {
    async beforeCreate(event) {
        const { group, activity, file, user, updatedBy, evaluator, qualification } = event.params.data;
        //check if qualification exists for the group
        //when evaluator uploads a qualification we dont need to check if the activity has passed
        if (updatedBy !== undefined) {
            // check who is updating the qualification
            const author = (
                await strapi.entityService.findMany("admin::user", {
                    filters: { id: updatedBy }
                })
            )[0];
            if (author) return;
        }
        if (activity === undefined || (evaluator !== undefined)) {

            if (evaluator == undefined) return

            const activityData = await strapi.entityService.findOne("api::activity.activity", activity, {
                populate: {
                    subsection: {
                        populate: {
                            section: {
                                populate: {
                                    course: true
                                }
                            }
                        }
                    }
                },
            });
            const student = await strapi.db.query('plugin::users-permissions.user').findOne({
                where: { id: user }
            })
            try {
                await sendEmail({ qualification, activity: activity, activityData: activityData, user: student })
            }
            catch (error) {
                console.log(error)
            }
            return
        }
        if (group !== undefined) {
            const qualification = await strapi.db.query('api::qualification.qualification').findOne({
                where: {
                    group: group,
                    activity: activity
                }
            });

            if (qualification) {
                throw new Error("Qualification already exists for the group and activity");;
            }
        }
        console.log("before create qualification user", user?.id)
        if (user !== undefined) {
            const userQualification = await strapi.db.query('api::qualification.qualification').findOne({
                where: {
                    user: user,
                    activity: activity
                }
            });

            if (userQualification) {
                throw new Error("Qualification already exists for the user and activity");;
            }
        }
        const activityData = await strapi.db.query('api::activity.activity').findOne({
            where: {
                id: activity
            }
        });
        if (activityData.deadline) {
            if (new Date(activityData.deadline) < new Date()) {
                throw new Error("Activity deadline has passed");
            }
        }

    },
    async beforeUpdate(event) {
        const { group, activity, file, updatedBy, qualification } = event.params.data;

        if (updatedBy !== undefined) {
            // check who is updating the qualification
            const author = (
                await strapi.entityService.findMany("admin::user", {
                    filters: { id: updatedBy }
                })
            )[0];
            if (author) return;
        }

        const { where: { id } } = event.params

        //when evaluator uploads a qualification we dont need to check if the activity has passed
        if (activity === undefined) {

            const qualificationData = await strapi.entityService.findOne("api::qualification.qualification", id, {
                populate: {
                    activity: {
                        populate: {
                            subsection: {
                                populate: {
                                    section: {
                                        populate: {
                                            course: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    user: true
                },
            });
            const activityID = qualificationData?.activity?.id
            try {
                await sendEmail({ qualification, activity: activityID, activityData: qualificationData.activity, user: qualificationData.user })
            }
            catch (error) {
                console.log(error)
            }
            return
        }

        const activityData = await strapi.db.query('api::activity.activity').findOne({
            where: {
                id: activity
            },
            populate: {
                subsection: {
                    section: {
                        course: true
                    }
                }
            }
        });
        if (activityData.deadline) {
            if (new Date(activityData.deadline) < new Date()) {
                throw new Error("Activity deadline has passed");
            }
        }
    },


}

async function sendEmail({ qualification, activity, activityData, user }) {

    const courseID = activityData?.subsection?.section?.course?.id
    const userName = user?.name
    const userMail = user?.email
    if (userMail === undefined) {
        console.error("User has no email")
        return
    }

    if (qualification !== undefined) {
        const Mailjet = require('node-mailjet');

        const mailjet = new Mailjet.Client({
            apiKey: process.env.MAILJET_AUTH_API,
            apiSecret: process.env.MAILJET_AUTH_SECRET
        });

        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "uptitudeapp@gmail.com",
                            Name: "Uptitudeapp"
                        },
                        To: [
                            {
                                Email: userMail,
                                Name: userName
                            }
                        ],
                        Subject: "Qualification updated",
                        HTMLPart:
                            `<div>
                                <h2>Qualification updated for activity ${activityData.title}</h2>
                               <a href="https://uptitude.netlify.app/app/courses/${courseID}/activity/${activity}">Go to activity</a>
                            </div>`
                    }
                ]
            })
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })

    }
}