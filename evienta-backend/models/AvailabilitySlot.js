const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const AvailabilitySlot = sequelize.define('AvailabilitySlot', {
  vendor_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false
  },
  start_datetime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_datetime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  recurrence_rule: {
    type: DataTypes.STRING
  },
  is_blocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'AvailabilitySlots'
});

module.exports = AvailabilitySlot;
