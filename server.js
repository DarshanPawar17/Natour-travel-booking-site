const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err && err.name, err && err.message);
  console.error(err && err.stack);
  process.exit(1);
});

// Load environment variables and require app inside try/catch so we log full failures
try {
  dotenv.config({ path: './config.env' });
} catch (err) {
  console.error('Failed to load config.env:', err && err.stack ? err.stack : err);
  process.exit(1);
}

let app;
try {
  app = require('./app');
} catch (err) {
  console.error('Failed to require app module:');
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => {
    console.error('DB connection failed:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err && err.name, err && err.message);
  console.error(err && err.stack);
  server.close(() => {
    process.exit(1);
  });
});
