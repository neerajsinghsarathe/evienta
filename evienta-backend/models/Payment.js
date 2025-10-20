const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Payment = sequelize.define('Payment', {
  booking_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false,
    references: { model: 'Bookings', key: 'id' }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  provider: {
    type: DataTypes.STRING,
    defaultValue: 'Stripe'
  },
  provider_charge_id: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  },
  refunded_amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'Payments'
});

module.exports = Payment;
