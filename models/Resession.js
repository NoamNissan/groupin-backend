/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const Resession = sequelize.define(
        'Resession',
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING(45),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            recurrence_freq: {
                type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY'),
                allowNull: true
            },
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'resessions'
        }
    );

    Resession.associate = (models) => {
        Resession.belongsTo(models.User);
    };

    return Resession;
};
