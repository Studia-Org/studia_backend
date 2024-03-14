module.exports = {
    async beforeCreate(event) {
        const { group, activity, file, user } = event.params.data;
        //check if qualification exists for the group
        //when evaluator uploads a qualification we dont need to check if the activity has passed
        if (activity === undefined) {
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
        const { group, activity, file, updatedBy } = event.params.data;
        //when evaluator uploads a qualification we dont need to check if the activity has passed


        if (activity === undefined) {
            return
        }
        if (updatedBy !== undefined) {
            // check who is updating the qualification
            const author = (
                await strapi.entityService.findMany("admin::user", {
                    filters: { id: updatedBy }
                })
            )[0];
            if (author) return;

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
    }

}