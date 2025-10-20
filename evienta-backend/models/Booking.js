const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Booking = sequelize.define('Booking', {
  customer_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  vendor_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false,
    references: { model: 'VendorProfiles', key: 'id' }
  },
  service_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false,
    references: { model: 'Services', key: 'id' }
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
    type: DataTypes.INTEGER, // or DataTypes.UUID
    references: { model: 'Payments', key: 'id' }
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'Bookings'
});

module.exports = Booking;
