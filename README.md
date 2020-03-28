# Groupin-Backend
## Starting App

**Without Migrations**

```
npm install
npm start
```

**With Migrations**

```
npm install
node_modules/.bin/sequelize db:migrate
npm start
```

This will start the application and (optionally) migrate the MySQL tables if the database exists.

Note that the database must be configured with the details provided in `config/config.js`, otherwise change `config.js` according to your existing configuration.

if the database doesn't exist yet, run this before starting the app:
```
node_modules/.bin/sequelize db:createdb database_development 
```
(or any other database name according to `config.js` and your enviroment)

The backend will then be available at [http://localhost:6000](http://localhost:6000).

## Creating a new migration
Improved the DB's schemas by changing the data models? want to clarify that your version is superior in every way and should be used in every DB instance from now on? good! you need to create a new migration file.

In order to do so, simply run
```
node .\node_modules\sequelize-auto-migrations\bin\makemigration.js --name <migration_name>
```
you can then test your migration by running the db:migrate command stated above
