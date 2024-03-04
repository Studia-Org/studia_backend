module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/create_peers',
            handler: 'qualification.createPeers',
            config: {
                auth: false
            }
        }
    ],
}