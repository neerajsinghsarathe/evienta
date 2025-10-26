const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const VendorProfile = sequelize.define('VendorProfile', {
  user_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID if using UUIDs
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  business_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  city: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  country: {
    type: DataTypes.STRING
  },
  geo: {
    type: DataTypes.JSON // { lat, lng }
  },
  categories: {
    // MySQL does not support ARRAY type; store as JSON array
    type: DataTypes.JSON
  },
  services: {
    // MySQL does not support ARRAY(JSON); store as JSON array
    type: DataTypes.JSON
  }
}, {
  timestamps: true,
  tableName: 'VendorProfiles'
});

module.exports = VendorProfile;
