var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mysql = require('mysql');
var dbconfig = require('./db/config.js');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// setup DB connection
var connection = mysql.createConnection({
    host     : dbconfig.DB_HOST,
    port     : dbconfig.DB_PORT,
    user     : dbconfig.DB_USER,
    password : dbconfig.DB_PASSWORD,
    database : dbconfig.DB_NAME,
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

var graphqlHTTP = require("express-graphql");
var { mockSchema, mockResolver } = require("./schemas/mock_api_schema");

// The root provides a resolver function for each API endpoint
var root = app.use(
  "/graphql",
  graphqlHTTP({
    schema: mockSchema,
    rootValue: mockResolver,
    graphiql: true,
  })
);

console.log("Running a GraphQL API server at http://localhost:4000/graphql");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
