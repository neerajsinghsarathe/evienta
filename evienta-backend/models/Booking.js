const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Booking = sequelize.define('Booking', {
  customer_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false
  },
  vendor_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false
  },
  service_id: {
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
  hours: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hourly_rate: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'rejected'),
    defaultValue: 'pending'
  },
  payment_id: {
    type: DataTypes.INTEGER // or DataTypes.UUID
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'Bookings'
});

module.exports = Booking;
