var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var redis = require('redis');
var session = require('express-session');
var passport = require('passport');
const env = process.env.NODE_ENV || 'development';
var server_config = require('./config/server_config.js')[env];

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var db = require('./models');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (env == 'production' || env == 'test') {
    var RedisStore = require('connect-redis')(session);
    var redisClient = redis.createClient();
}

var sess = {
    store:
        env == 'production' || env == 'test'
            ? new RedisStore({ client: redisClient })
            : undefined,
    secret: server_config.session_secret,
    saveUninitialized: false,
    resave: false,
    cookie: {}
};

if (env == 'production' || env == 'test') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

var graphqlHTTP = require('express-graphql');
var schema = require('./schemas/api_schema');
var errors = require('./schemas/api_schema_errors');

const is_prod = process.env.NODE_ENV === 'production';

// The root provides a resolver function for each API endpoint
var root = app.use(
    '/graphql',
    graphqlHTTP((req) => ({
        schema: schema,
        // graphiql only when not in production
        graphiql: !is_prod,
        context: { db: db, user: req.user },
        customFormatErrorFn: (error) => {
            // We'd like to translate the error we've gotten to the FormatError
            // if it exists and then report it, if such object does not exist,
            // don't propagate the error to the client (do LOG it!)
            const secondary_error = errors.errorType[error.message];

            // An unexepcted error was raised, that's bad!
            if (!secondary_error) {
                // TODO: log the bug here

                // I'm fine with returning the real error if we're not in prod
                if (is_prod) {
                    return errors.errorType['INTERNAL_SERVER_ERROR'];
                } else {
                    return error;
                }
            }

            return secondary_error;
        }
    }))
);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
