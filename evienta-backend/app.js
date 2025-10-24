var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


var indexRouter = require('./routes/index');

var app = express();

// Enable CORS for all routes with custom options
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight OPTIONS requests globally
app.options('*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

// Sequelize DB connection check, model registration, and schema sync
try {
  const sequelize = require('./models/sequelize');
  sequelize
    .authenticate()
    .then(async () => {
      const dbName =
        typeof sequelize.getDatabaseName === 'function'
          ? sequelize.getDatabaseName()
          : (sequelize.config && sequelize.config.database) || process.env.DB_NAME || 'unknown';
      console.log(`Database connection status: connected to "${dbName}"`);

      // Ensure all models and associations are registered before syncing
      require('./models');

      // Control sync behavior via env vars; defaults are safe and non-destructive
      const alter = process.env.DB_SYNC_ALTER === 'true';
      const force = process.env.DB_SYNC_FORCE === 'true';

      try {
        await sequelize.sync({ alter, force });
        console.log(
          `Sequelize sync successful${alter ? ' (alter)' : ''}${force ? ' (force)' : ''}. Tables are up-to-date.`
        );
      } catch (syncErr) {
        console.error('Sequelize sync failed:', syncErr.message);
      }
    })
    .catch((err) => {
      const dbName = (sequelize.config && sequelize.config.database) || process.env.DB_NAME || 'unknown';
      console.error(`Database connection status: failed for "${dbName}". Error: ${err.message}`);
    });
} catch (e) {
  console.error('Failed to initialize Sequelize:', e.message);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
