const AdminAuditLog = require('../models/AdminAuditLog');

module.exports = {
  async createAuditLog(data) {
    return await AdminAuditLog.create(data);
  },
  async getAuditLogById(id) {
    return await AdminAuditLog.findByPk(id);
  },
  async listAuditLogs(filter = {}) {
    return await AdminAuditLog.findAll({ where: filter });
  },
};
