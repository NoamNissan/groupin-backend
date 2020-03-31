// This is a hack to fix Sequelize's charset encoding setting
//
// Oddly Sequelize ignores the charset configuration in config.js when issuing a
// created command, so we'll just add a migration that will always be first and
// fix the database encoding
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            `ALTER DATABASE ${queryInterface.sequelize.config.database}
        CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`
        );
    },
    down: (queryInterface, Sequelize) => {}
};
