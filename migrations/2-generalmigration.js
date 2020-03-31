'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "username" on table "resessions"
 *
 **/

var info = {
    revision: 2,
    name: 'generalmigration',
    created: '2020-03-29T11:09:26.556Z',
    comment: ''
};

var migrationCommands = function (transaction) {
    return [
        {
            fn: 'changeColumn',
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
        }
    ];
};
var rollbackCommands = function (transaction) {
    return [
        {
            fn: 'changeColumn',
            params: [
                'resessions',
                'username',
                {
                    type: Sequelize.STRING(45),
                    field: 'username',
                    references: {
                        model: 'users',
                        key: 'username'
                    },
                    allowNull: true
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
