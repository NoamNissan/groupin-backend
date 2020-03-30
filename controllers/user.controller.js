var passport = require('passport');
var strategy = require('passport-facebook');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/facebook_oauth.js')[env];
const FacebookStrategy = strategy.Strategy;

/*
    Session logic: this function runs while rendering
    the session object of the current session. we want this
    user to be identified with future request of the same client.
    here we do it ugly and save the entire user object in the session object
    but the correct way to do it is to save an identifier if the user
    in the DB so in later request we just have to take the identifier
    and pull the user with a query.

 */
passport.serializeUser(function(user, done) {
    done(null, user);
});

/*
    Session logic: this runs function runs as part of a middleware
    that runs before the handler of a GET request. it takes the
    information saved in the session and forges the user object
    that will be in req.user in the request handler. here we just
    saved the entire user object in the session but the correct way
    to do it is to save just an identifier that will help us to extract
    the user from the DB.
 */
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

/*
    Login logic: the callback is runs when the client comes back from
    talking with facebook and a connection is successfull (where it is
    a new user or a reconnecting user) this is the place to check if
    a user is in the db and if not, add it. the object passed to done
    while later go through serializeUser so it is a good idea to add
    our user's unique id there or simply pass our own object instead
    of what facebook gave us.

    also, the picture field holds a url to download the user's profile
    picture. it is now a good time to decide if we want to save the url
    or the picture itself.

    Example of the profile object:
[1] {
[1]   id: '10158052852288610',
[1]   displayName: 'Noam Nissan',
[1]   name: { familyName: 'Nissan', givenName: 'Noam' },
[1]   emails: [ { value: 'non847@gmail.com' } ],
[1]   photos: [
[1]     {
[1]       value: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10158052852288610&height=50&width=50&ext=1588173481&hash=AeR4nNFgmoq4-k6F'
[1]     }
[1]   ],
[1]   provider: 'facebook',
[1]   _raw: '{"last_name":"Nissan","first_name":"Noam","name":"Noam Nissan","email":"non847\\u0040gmail.com","picture":{"data":{"height":50,"is_silhouette":false,"url":"https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/?asid=10158052852288610&height=50&width=50&ext=1588173481&hash=AeR4nNFgmoq4-k6F","width":50}},"id":"10158052852288610"}',
[1]   _json: {
[1]     last_name: 'Nissan',
[1]     first_name: 'Noam',
[1]     name: 'Noam Nissan',
[1]     email: 'non847@gmail.com',
[1]     picture: { data: [Object] },
[1]     id: '10158052852288610'
[1]   }
[1] }

 */
passport.use(
    new FacebookStrategy(
        {
            clientID: config.client_id,
            clientSecret: config.client_secret,
            callbackURL: config.callback_url,
            profileFields: ["name", "displayName", "email", "picture"]
        },
        function(accessToken, refreshToken, profile, done) {
            console.log('A successfull login as occured. (is that a new user?)');
            console.log(profile);

            const { email, first_name, last_name, picture } = profile._json;
            const userData = {
                email,
                firstName: first_name,
                lastName: last_name,
                picture
            };
            // new userModel(userData).save();
            done(null, profile);
        }
    )
);
