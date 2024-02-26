module.exports = {
    async beforeCreate(event) {
        const { group, activity, file, } = event.params.data;
        //check if qualification exists for the group
        //when evaluator uploads a qualification we dont need to check if the activity has passed
        if (activity === undefined) {
            return
        }

        const qualification = await strapi.db.query('api::qualification.qualification').findOne({
            where: {
                group: group,
                activity: activity
            }
        });

        if (qualification) {
            throw new Error("Qualification already exists for the group and activity");;
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
        const { group, activity, file } = event.params.data;
        //when evaluator uploads a qualification we dont need to check if the activity has passed

        if (activity === undefined) {
            return
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