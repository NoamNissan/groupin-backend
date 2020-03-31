/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'Category',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            default_image: {
                type: DataTypes.BLOB,
                allowNull: true
            }
        },
        {
            tableName: 'categories'
        }
    );
};
