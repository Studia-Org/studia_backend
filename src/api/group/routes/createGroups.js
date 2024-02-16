module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/create_groups',
            handler: 'group.createGroups',
            config: {
                auth: false
            }
        }
    ],
}