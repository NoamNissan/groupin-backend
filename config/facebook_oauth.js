module.exports = {
    development: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        callback_url: 'http://localhost:4000/users/auth/facebook/callback'
    },

    test: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        callback_url: 'http://localhost:4000/users/auth/facebook/callback'
    },

    production: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        callback_url: process.env.FACEBOOK_CALLBACK_URL
    }
};
