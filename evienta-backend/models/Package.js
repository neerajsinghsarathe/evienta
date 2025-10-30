const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Package = sequelize.define('Package', {
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'VendorProfiles', key: 'id' }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  features: {
    type: DataTypes.JSON // Store package features as a JSON array
  }
}, {
  timestamps: true,
  tableName: 'Packages'
});

module.exports = Package;