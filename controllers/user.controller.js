var passport = require('passport');
var strategy = require('passport-facebook');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/facebook_oauth.js')[env];
const db = require('../models');
const FacebookStrategy = strategy.Strategy;

// Serialize data into the session. sending only the user id
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize the user data from the session. find user by user id
passport.deserializeUser(function(obj, done) {
    db.User.findOne({where : {id : obj}}).then((user) => {
        if(!user) {
            done(null, undefined);
        }
        else {
            done(null, user);
        }
    })
});

passport.use(
    new FacebookStrategy(
        {
            clientID: config.client_id,
            clientSecret: config.client_secret,
            callbackURL: config.callback_url,
            profileFields: ["name", "displayName", "email", "picture"]
        },
        function(accessToken, refreshToken, profile, done) {
            const { email, name, picture, id } = profile._json;
            db.User.findOne({where : {email}}).then((user) => {
                if(user) {
                    return done(null, user);
                }
                else {
                    var newUser = {
                        display_name : name,
                        email : email,
                        provider : 'facebook',
                        provider_user_id : id,
                        img_source : picture.data.url,
                    }
                    db.User.create(newUser).then((newUser, created) => {
                        if(!newUser) {
                            return done(null, false, {message: 'user creation failed'});
                        }
                        else {
                            return done(null, newUser);
                        }
                    })
                        .catch((err) => {
                            return done(err);
                        });
                }
            })
        }
    )
);
