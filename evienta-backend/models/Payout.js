const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Payout = sequelize.define('Payout', {
  vendor_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false,
    references: { model: 'VendorProfiles', key: 'id' }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  provider_payout_id: {
    type: DataTypes.STRING
  },
  period_start: {
    type: DataTypes.DATE
  },
  period_end: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  tableName: 'Payouts'
});

module.exports = Payout;
