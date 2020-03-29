/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    password_hash: {
      type: DataTypes.STRING(45),
      allowNull: false
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
      type: DataTypes.STRING(128),
      allowNull: true
    }
  }, {
    tableName: 'users'
  });
};
