module.exports = {
  development: {
    username: "gorupin",
    password: "Passwordm0reSeCret",
    database: "groupin",
    host: "127.0.0.1",
    port: "3306",
    dialect: "mysql",
  },
  test: {
    username: "gorupin",
    password: "Passwordm0reSeCret",
    database: "groupin",
    host: "127.0.0.1",
    port: "3306",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: "mysql",
    use_env_variable: "DATABASE_URL",
  },
};
