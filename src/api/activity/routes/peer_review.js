module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/peer_review_pairing',
            handler: 'activity.peerReviewPairing',
            config: {
                auth: false
            }
        }
    ],
}