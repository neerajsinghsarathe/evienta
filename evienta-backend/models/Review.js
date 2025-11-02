const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Review = sequelize.define('Review', {
  booking_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false
  },
  customer_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false
  },
  vendor_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false
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
