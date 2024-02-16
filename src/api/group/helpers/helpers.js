async function deleteGroups({ strapi, activityId }) {
    const allGroups = await strapi.db.query("api::group.group").findMany({
        where: {
            activity: {
                id: activityId
            }
        }
    });

    Promise.all(allGroups.map(async (group) => {
        const delete_group = await strapi.db.query("api::group.group").delete({
            where: {
                id: group.id
            }
        });
    }));
}
module.exports = {
    deleteGroups
}