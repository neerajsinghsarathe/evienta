const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Service = sequelize.define('Service', {
  vendor_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false,
    references: { model: 'VendorProfiles', key: 'id' }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  hourly_rate: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  min_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  images: {
    // MySQL does not support ARRAY type; store as JSON array
    type: DataTypes.JSON
  }
}, {
  timestamps: true,
  tableName: 'Services'
});

module.exports = Service;
