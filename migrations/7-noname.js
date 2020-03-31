'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "end_date" on table "sessions"
 * changeColumn "start_date" on table "sessions"
 *
 **/

var info = {
    revision: 7,
    name: 'noname',
    created: '2020-03-30T19:00:11.349Z',
    comment: ''
};

var migrationCommands = function (transaction) {
    return [
        {
            fn: 'changeColumn',
            params: [
                'sessions',
                'end_date',
                {
                    type: Sequelize.DATE,
                    field: 'end_date',
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
                'start_date',
                {
                    type: Sequelize.DATE,
                    field: 'start_date',
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
            fn: 'changeColumn',
            params: [
                'sessions',
                'end_date',
                {
                    type: Sequelize.DATEONLY,
                    field: 'end_date',
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
                'start_date',
                {
                    type: Sequelize.DATEONLY,
                    field: 'start_date',
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
