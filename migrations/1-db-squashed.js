'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "categories", deps: []
 * createTable "users", deps: []
 * createTable "resessions", deps: [users]
 * createTable "sessions", deps: [users, categories, resessions]
 *
 **/

var info = {
    revision: 1,
    name: 'db-squashed',
    created: '2020-04-01T18:51:35.582Z',
    comment: ''
};

var migrationCommands = function (transaction) {
    return [
        {
            fn: 'createTable',
            params: [
                'categories',
                {
                    id: {
                        type: Sequelize.INTEGER,
                        field: 'id',
                        primaryKey: true,
                        autoIncrement: true,
                        allowNull: false
                    },
                    name: {
                        type: Sequelize.STRING(100),
                        field: 'name',
                        allowNull: false
                    },
                    default_image: {
                        type: Sequelize.BLOB,
                        field: 'default_image',
                        allowNull: true
                    },
                    createdAt: {
                        type: Sequelize.DATE,
                        field: 'createdAt',
                        allowNull: false
                    },
                    updatedAt: {
                        type: Sequelize.DATE,
                        field: 'updatedAt',
                        allowNull: false
                    }
                },
                {
                    charset: 'utf8mb4',
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'createTable',
            params: [
                'users',
                {
                    id: {
                        type: Sequelize.INTEGER.UNSIGNED,
                        field: 'id',
                        primaryKey: true,
                        autoIncrement: true,
                        allowNull: false
                    },
                    provider: {
                        type: Sequelize.ENUM('FACEBOOK'),
                        field: 'provider',
                        allowNull: false
                    },
                    provider_user_id: {
                        type: Sequelize.STRING(45),
                        field: 'provider_user_id',
                        unique: true,
                        allowNull: false
                    },
                    email: {
                        type: Sequelize.STRING(45),
                        field: 'email',
                        unique: true,
                        allowNull: false
                    },
                    display_name: {
                        type: Sequelize.STRING(45),
                        field: 'display_name',
                        allowNull: false
                    },
                    is_admin: {
                        type: Sequelize.BOOLEAN,
                        field: 'is_admin',
                        defaultValue: false,
                        allowNull: true
                    },
                    is_premium: {
                        type: Sequelize.BOOLEAN,
                        field: 'is_premium',
                        defaultValue: false,
                        allowNull: true
                    },
                    img_source: {
                        type: Sequelize.STRING(256),
                        field: 'img_source',
                        allowNull: true
                    },
                    createdAt: {
                        type: Sequelize.DATE,
                        field: 'createdAt',
                        allowNull: false
                    },
                    updatedAt: {
                        type: Sequelize.DATE,
                        field: 'updatedAt',
                        allowNull: false
                    }
                },
                {
                    charset: 'utf8mb4',
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'createTable',
            params: [
                'resessions',
                {
                    id: {
                        type: Sequelize.INTEGER.UNSIGNED,
                        field: 'id',
                        primaryKey: true,
                        autoIncrement: true,
                        allowNull: false
                    },
                    title: {
                        type: Sequelize.STRING(45),
                        field: 'title',
                        allowNull: false
                    },
                    description: {
                        type: Sequelize.STRING(500),
                        field: 'description',
                        allowNull: true
                    },
                    recurrence_freq: {
                        type: Sequelize.ENUM('DAILY', 'WEEKLY', 'MONTHLY'),
                        field: 'recurrence_freq',
                        allowNull: true
                    },
                    user_id: {
                        type: Sequelize.INTEGER.UNSIGNED,
                        field: 'user_id',
                        references: {
                            model: 'users',
                            key: 'id'
                        },
                        allowNull: false
                    },
                    createdAt: {
                        type: Sequelize.DATE,
                        field: 'createdAt',
                        allowNull: false
                    },
                    updatedAt: {
                        type: Sequelize.DATE,
                        field: 'updatedAt',
                        allowNull: false
                    }
                },
                {
                    charset: 'utf8mb4',
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'createTable',
            params: [
                'sessions',
                {
                    id: {
                        type: Sequelize.INTEGER.UNSIGNED,
                        field: 'id',
                        primaryKey: true,
                        autoIncrement: true,
                        allowNull: false
                    },
                    user_id: {
                        type: Sequelize.INTEGER.UNSIGNED,
                        field: 'user_id',
                        references: {
                            model: 'users',
                            key: 'id'
                        },
                        allowNull: false
                    },
                    title: {
                        type: Sequelize.STRING(45),
                        field: 'title',
                        allowNull: false
                    },
                    description: {
                        type: Sequelize.STRING(2000),
                        field: 'description',
                        allowNull: true
                    },
                    category: {
                        type: Sequelize.INTEGER,
                        field: 'category',
                        references: {
                            model: 'categories',
                            key: 'id'
                        },
                        allowNull: true
                    },
                    tags: {
                        type: Sequelize.STRING(128),
                        field: 'tags',
                        allowNull: true
                    },
                    start_date: {
                        type: Sequelize.DATE,
                        field: 'start_date',
                        allowNull: false
                    },
                    end_date: {
                        type: Sequelize.DATE,
                        field: 'end_date',
                        allowNull: false
                    },
                    capacity: {
                        type: Sequelize.INTEGER.UNSIGNED,
                        field: 'capacity',
                        allowNull: true
                    },
                    attendees: {
                        type: Sequelize.INTEGER.UNSIGNED,
                        field: 'attendees',
                        allowNull: true
                    },
                    platform: {
                        type: Sequelize.ENUM('ZOOM'),
                        field: 'platform',
                        allowNull: true
                    },
                    platform_media_id: {
                        type: Sequelize.STRING(128),
                        field: 'platform_media_id',
                        allowNull: true
                    },
                    img_source: {
                        type: Sequelize.STRING(128),
                        field: 'img_source',
                        allowNull: true
                    },
                    resession_id: {
                        type: Sequelize.INTEGER.UNSIGNED,
                        field: 'resession_id',
                        references: {
                            model: 'resessions',
                            key: 'id'
                        },
                        allowNull: true
                    },
                    createdAt: {
                        type: Sequelize.DATE,
                        field: 'createdAt',
                        allowNull: false
                    },
                    updatedAt: {
                        type: Sequelize.DATE,
                        field: 'updatedAt',
                        allowNull: false
                    }
                },
                {
                    charset: 'utf8mb4',
                    transaction: transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function (transaction) {
    return [
        {
            fn: 'dropTable',
            params: [
                'categories',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'dropTable',
            params: [
                'resessions',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'dropTable',
            params: [
                'sessions',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'dropTable',
            params: [
                'users',
                {
                    transaction: transaction
                }
            ]
        }
    ];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function (queryInterface, Sequelize, _commands) {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function (resolve, reject) {
                function next() {
                    if (index < commands.length) {
                        let command = commands[index];
                        console.log('[#' + index + '] execute: ' + command.fn);
                        index++;
                        queryInterface[command.fn]
                            .apply(queryInterface, command.params)
                            .then(next, reject);
                    } else resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function (queryInterface, Sequelize) {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function (queryInterface, Sequelize) {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};
