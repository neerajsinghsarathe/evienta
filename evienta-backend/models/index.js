// Sequelize initialization template (non-intrusive)
// To enable Sequelize, install the dependencies and configure your DB connection.
//   npm i sequelize pg pg-hstore     # for Postgres (example)
//   npm i sequelize mysql2           # for MySQL/MariaDB (example)
// Then fill in the configuration below and require models as needed.

const Sequelize = require('sequelize');

// Example: environment variables (adjust to your setup)
const dialect = process.env.DB_DIALECT || 'mysql';
const database = process.env.DB_NAME || 'evienta';
const username = process.env.DB_USER || 'user';
const password = process.env.DB_PASS || 'pass';
const host = process.env.DB_HOST || '127.0.0.1';
const logging = process.env.DB_LOGGING === 'true';

// Use a shared Sequelize instance to avoid circular dependencies
const sequelize = require('./sequelize');

const db = {};
db.User = require('./User');
db.VendorProfile = require('./VendorProfile');
db.Service = require('./Service');
db.AvailabilitySlot = require('./AvailabilitySlot');
db.Booking = require('./Booking');
db.Payment = require('./Payment');
db.Review = require('./Review');
db.AdminAuditLog = require('./AdminAuditLog');
db.Payout = require('./Payout');
db.Notification = require('./Notification');

// Associations
// User
// User hasMany VendorProfile, Booking, Review, Notification, AdminAuditLog
// VendorProfile belongsTo User, hasMany Service, AvailabilitySlot, Booking, Review, Payout
// Service belongsTo VendorProfile, hasMany Booking
// Booking belongsTo User (customer), VendorProfile, Service, Payment, Review
// Payment belongsTo Booking
// Review belongsTo Booking, User (customer), VendorProfile
// AdminAuditLog belongsTo User (admin)
// Payout belongsTo VendorProfile
// Notification belongsTo User

db.User.hasMany(db.VendorProfile, { foreignKey: 'user_id' });
db.VendorProfile.belongsTo(db.User, { foreignKey: 'user_id' });

db.VendorProfile.hasMany(db.Service, { foreignKey: 'vendor_id' });
db.Service.belongsTo(db.VendorProfile, { foreignKey: 'vendor_id' });

db.VendorProfile.hasMany(db.AvailabilitySlot, { foreignKey: 'vendor_id' });
db.AvailabilitySlot.belongsTo(db.VendorProfile, { foreignKey: 'vendor_id' });

db.User.hasMany(db.Booking, { foreignKey: 'customer_id' });
db.Booking.belongsTo(db.User, { foreignKey: 'customer_id' });

db.VendorProfile.hasMany(db.Booking, { foreignKey: 'vendor_id' });
db.Booking.belongsTo(db.VendorProfile, { foreignKey: 'vendor_id' });

db.Service.hasMany(db.Booking, { foreignKey: 'service_id' });
db.Booking.belongsTo(db.Service, { foreignKey: 'service_id' });

db.Booking.hasOne(db.Payment, { foreignKey: 'booking_id' });
db.Payment.belongsTo(db.Booking, { foreignKey: 'booking_id' });

db.Booking.hasOne(db.Review, { foreignKey: 'booking_id' });
db.Review.belongsTo(db.Booking, { foreignKey: 'booking_id' });

db.User.hasMany(db.Review, { foreignKey: 'customer_id' });
db.Review.belongsTo(db.User, { foreignKey: 'customer_id' });

db.VendorProfile.hasMany(db.Review, { foreignKey: 'vendor_id' });
db.Review.belongsTo(db.VendorProfile, { foreignKey: 'vendor_id' });

db.VendorProfile.hasMany(db.Payout, { foreignKey: 'vendor_id' });
db.Payout.belongsTo(db.VendorProfile, { foreignKey: 'vendor_id' });

db.User.hasMany(db.AdminAuditLog, { foreignKey: 'admin_id' });
db.AdminAuditLog.belongsTo(db.User, { foreignKey: 'admin_id' });

db.User.hasMany(db.Notification, { foreignKey: 'user_id' });
db.Notification.belongsTo(db.User, { foreignKey: 'user_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
