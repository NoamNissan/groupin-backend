'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "platform_media_pwd" to table "sessions"
 * changeColumn "platform_media_id" on table "sessions"
 *
 **/

var info = {
    "revision": 3,
    "name": "noname",
    "created": "2020-04-04T22:14:58.984Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "addColumn",
            params: [
                "sessions",
                "platform_media_pwd",
                {
                    "type": Sequelize.STRING(64),
                    "field": "platform_media_pwd",
                    "allowNull": true
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "sessions",
                "platform_media_id",
                {
                    "type": Sequelize.STRING(64),
                    "field": "platform_media_id",
                    "allowNull": true
                },
                {
                    transaction: transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "removeColumn",
            params: [
                "sessions",
                "platform_media_pwd",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "sessions",
                "platform_media_id",
                {
                    "type": Sequelize.STRING(128),
                    "field": "platform_media_id",
                    "allowNull": true
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
    execute: function(queryInterface, Sequelize, _commands)
    {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log("[#"+index+"] execute: " + command.fn);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
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
    up: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};
