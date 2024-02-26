module.exports = {
    async beforeCreate(event) {
        const { group, activity, file } = event.params.data;
        //check if qualification exists for the group
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