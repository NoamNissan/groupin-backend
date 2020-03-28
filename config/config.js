module.exports = {
  development: {
    username: "user1",
    password: "password1",
    database: "database_development",
    host: "localhost",
    dialect: "mysql"
  },
  test: {
    username: "user1",
    password: "password1",
    database: "database_test",
    host: "localhost",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    use_env_variable: 'DATABASE_URL'
  }
};