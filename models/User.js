/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    provider: {
      type: DataTypes.ENUM('FACEBOOK'),
      allowNull: false
    },
    provider_user_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    display_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    img_source: {
      type: DataTypes.STRING(256),
      allowNull: true
    }
  }, {
    tableName: 'users'
  });
};
