var FormatError = require('easygraphql-format-error');

const errors = new FormatError([
    {
        name: 'COUNT_TOO_HIGH',
        message: 'The passed count value is too high',
        statusCode: 400
    },
    {
        name: 'UNLOGGED_USER',
        message: 'This action is prohibited for non-users',
        statusCode: 401
    }
]);

module.exports = errors;
