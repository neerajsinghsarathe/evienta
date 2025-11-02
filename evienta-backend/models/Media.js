const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Media = sequelize.define('Media', {
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'Media'
});

module.exports = Media;