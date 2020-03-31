/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const Session = sequelize.define(
        'Session',
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            title: {
                type: DataTypes.STRING(45),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(2000),
                allowNull: true
            },
            category: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'categories',
                    key: 'id'
                }
            },
            tags: {
                type: DataTypes.STRING(128),
                allowNull: true
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            capacity: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true
            },
            attendees: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true
            },
            platform: {
                type: DataTypes.ENUM('ZOOM'),
                allowNull: true
            },
            platform_media_id: {
                type: DataTypes.STRING(128),
                allowNull: true
            },
            img_source: {
                type: DataTypes.STRING(128),
                allowNull: true
            },
            resession_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'resessions',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'sessions'
        }
    );

    Session.associate = (models) => {
        Session.belongsTo(models.User);
    };

    return Session;
};
