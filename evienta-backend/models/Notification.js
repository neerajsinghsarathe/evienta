const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Notification = sequelize.define('Notification', {
  user_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payload: {
    type: DataTypes.JSON
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'Notifications'
});

module.exports = Notification;
