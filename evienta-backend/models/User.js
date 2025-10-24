const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar_url: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.ENUM('customer', 'vendor', 'admin'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended'),
    defaultValue: 'active'
  },
  meta: {
    type: DataTypes.JSON
  }
}, {
  timestamps: true,
  tableName: 'Users'
});

module.exports = User;
