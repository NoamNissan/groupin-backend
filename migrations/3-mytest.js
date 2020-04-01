'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "username" from table "resessions"
 * removeColumn "username" from table "sessions"
 * removeColumn "password_hash" from table "users"
 * removeColumn "username" from table "users"
 * addColumn "provider_user_id" to table "users"
 * addColumn "provider" to table "users"
 * addColumn "id" to table "users"
 * addColumn "user_id" to table "resessions"
 * addColumn "user_id" to table "sessions"
 * changeColumn "platform" on table "sessions"
 *
 **/

var info = {
    revision: 3,
    name: 'mytest',
    created: '2020-03-29T20:23:19.909Z',
    comment: ''
};

var migrationCommands = function (transaction) {
    return [
        {
            fn: 'removeColumn',
            params: [
                'resessions',
                'username',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'removeColumn',
            params: [
                'sessions',
                'username',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'removeColumn',
            params: [
                'users',
                'password_hash',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'removeColumn',
            params: [
                'users',
                'username',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'addColumn',
            params: [
                'users',
                'provider_user_id',
                {
                    type: Sequelize.STRING(45),
                    field: 'provider_user_id',
                    unique: true,
                    allowNull: false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'addColumn',
            params: [
                'users',
                'provider',
                {
                    type: Sequelize.ENUM('FACEBOOK'),
                    field: 'provider',
                    allowNull: false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'addColumn',
            params: [
                'users',
                'id',
                {
                    type: Sequelize.INTEGER.UNSIGNED,
                    field: 'id',
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'addColumn',
            params: [
                'resessions',
                'user_id',
                {
                    type: Sequelize.INTEGER.UNSIGNED,
                    field: 'user_id',
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    allowNull: false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'addColumn',
            params: [
                'sessions',
                'user_id',
                {
                    type: Sequelize.INTEGER.UNSIGNED,
                    field: 'user_id',
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    allowNull: false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'changeColumn',
            params: [
                'sessions',
                'platform',
                {
                    type: Sequelize.ENUM('ZOOM'),
                    field: 'platform',
                    allowNull: false
                },
                {
                    transaction: transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function (transaction) {
    return [
        {
            fn: 'removeColumn',
            params: [
                'resessions',
                'user_id',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'removeColumn',
            params: [
                'sessions',
                'user_id',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'removeColumn',
            params: [
                'users',
                'provider_user_id',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'removeColumn',
            params: [
                'users',
                'provider',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'removeColumn',
            params: [
                'users',
                'id',
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'addColumn',
            params: [
                'users',
                'password_hash',
                {
                    type: Sequelize.STRING(45),
                    field: 'password_hash',
                    allowNull: false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'addColumn',
            params: [
                'users',
                'username',
                {
                    type: Sequelize.STRING(45),
                    field: 'username',
                    primaryKey: true,
                    allowNull: false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'addColumn',
            params: [
                'resessions',
                'username',
                {
                    type: Sequelize.STRING(45),
                    field: 'username',
                    references: {
                        model: 'users',
                        key: 'username'
                    }
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'addColumn',
            params: [
                'sessions',
                'username',
                {
                    type: Sequelize.STRING(45),
                    field: 'username',
                    references: {
                        model: 'users',
                        key: 'username'
                    },
                    allowNull: false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: 'changeColumn',
            params: [
                'sessions',
                'platform',
                {
                    type: Sequelize.ENUM('ZOOM', 'FACEBOOK'),
                    field: 'platform',
                    allowNull: false
                },
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
