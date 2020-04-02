fs = require('fs');
dotenv = require('dotenv');
dotenv.config();
module.exports = {
    development: {
        username: 'groupin',
        password: 'Passwordm0reSeCret',
        database: 'groupin_development',
        host: '127.0.0.1',
        port: '3306',
        dialect: 'mysql',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        },
        logging: console.log
    },
    test: {
        username: 'groupin',
        password: 'Passwordm0reSeCret',
        database: 'groupin_test',
        host: '127.0.0.1',
        port: '3306',
        dialect: 'mysql',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        }
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
            ssl: {
                ca: fs.readFileSync(__dirname + '/BaltimoreCyberTrustRoot.crt.pem')
            }
        },
        // use_env_variable: 'DATABASE_URL',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        }
    }
};
