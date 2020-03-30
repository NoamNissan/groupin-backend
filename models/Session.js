/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'users',
        key: 'username'
      }
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(45),
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
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
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
      type: DataTypes.ENUM('ZOOM','FACEBOOK'),
      allowNull: false
    },
    platform_media_id: {
      type: DataTypes.STRING(128),
      allowNull: false
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
  }, {
    tableName: 'sessions'
  });
};
