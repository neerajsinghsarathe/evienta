require('dotenv').config();
const { Sequelize } = require('sequelize');

// Example: environment variables (adjust to your setup)
const dialect = process.env.DB_DIALECT || 'mysql';
const database = process.env.DB_NAME || 'evienta_dev';
const username = process.env.DB_USER || 'root';
const password = process.env.DB_PASS || 'admin123';
const host = process.env.DB_HOST || '127.0.0.1';
const logging = process.env.DB_LOGGING === 'true';

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging,
});

module.exports = sequelize;
