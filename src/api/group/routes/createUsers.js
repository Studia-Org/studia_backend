module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/create-users',
            handler: 'group.createUsers',
            config: {
                auth: false
            }
        }
    ],
}