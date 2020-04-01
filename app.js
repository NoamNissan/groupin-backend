var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mysql = require('mysql');
var redis = require('redis');
var session = require('express-session');
var passport = require('passport');
const env = process.env.NODE_ENV || 'development';
var dbconfig = require('./config/config.js')[env];

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var db = require('./models');

// setup DB connection
var connection = mysql.createConnection({
    host: dbconfig.host,
    port: dbconfig.port,
    user: dbconfig.username,
    password: dbconfig.password
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // DO NOT MODIFY THIS LINE, IT MAY SCREW UP EXPRESS-SESSION
if(env == 'production' || env == 'test') {
    var RedisStore = require('connect-redis')(session);
    var redisClient = redis.createClient();
}
app.use(session({
    store: (env == 'production' || env == 'test') ? new RedisStore({ client: redisClient }) : undefined,
    secret: 'groupin-session-salt-very-very-secret',
    saveUninitialized: false,
    resave : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var graphqlHTTP = require('express-graphql');
var schema = require('./schemas/api_schema');
var errors = require('./schemas/api_schema_errors');

const is_prod = process.env.NODE_ENV === 'production';

// The root provides a resolver function for each API endpoint
var root = app.use(
    '/graphql',
  graphqlHTTP({
        schema: schema,
        // graphiql only when not in production
        graphiql: !is_prod,
        context: { db: db },
        customFormatErrorFn: (error) => {
            // We'd like to translate the error we've gotten to the FormatError
            // if it exists and then report it, if such object does not exist,
            // don't propagate the error to the client (do LOG it!)
            const error_secondary = errors.getError(error);

            // An unexepcted error was raised, that's bad!
            if (error === error_secondary) {
                // TODO: log the bug here

                // I'm fine with returning the real error if we're not in prod
                if (is_prod) {
                    return errors.errorType['INTERNAL_SERVER_ERROR'];
                }
            }

            return error;
        }
  })
);

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
