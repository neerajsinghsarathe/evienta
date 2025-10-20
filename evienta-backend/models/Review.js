const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Review = sequelize.define('Review', {
  booking_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false,
    references: { model: 'Bookings', key: 'id' }
  },
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'Reviews'
});

module.exports = Review;
