/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Resession', {
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
      type: DataTypes.ENUM('DAILY','WEEKLY','MONTHLY'),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: true,
      references: {
        model: 'users',
        key: 'username'
      }
    }
  }, {
    tableName: 'resessions'
  });
};
