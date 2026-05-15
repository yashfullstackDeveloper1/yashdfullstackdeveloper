// Keep some database connections ready so server responds faster!
const { Pool } = require('pg');
// Load .env file values so we can use DB_HOST, DB_PASSWORD etc
require('dotenv').config();

// Create a connection to PostgreSQL using details from .env file
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// if connect print 1 if not then print 2 line error code
pool.connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection failed:', err));

// Share this pool with other files so they can also use the database connection
module.exports = pool;