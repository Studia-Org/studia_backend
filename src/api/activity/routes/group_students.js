module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/create_groups_students',
            handler: 'activity.createGroupsStudents',
            config: {
                auth: false
            }
        }
    ],
}