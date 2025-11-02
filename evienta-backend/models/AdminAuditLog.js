const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const AdminAuditLog = sequelize.define('AdminAuditLog', {
  admin_id: {
    type: DataTypes.INTEGER, // or DataTypes.UUID
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.JSON
  },
  ip: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  tableName: 'AdminAuditLogs'
});

module.exports = AdminAuditLog;
