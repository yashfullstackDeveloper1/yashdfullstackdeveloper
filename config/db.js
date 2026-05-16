const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://scos_db_xt9u_user:BVZsQs7AAG0YwiXGvwknIJ2z9XO4wRKz@dpg-d841c5jtqb8s73et9rl0-a.oregon-postgres.render.com/scos_db_xt9u';

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => console.error('❌ Database connection failed:', err));

module.exports = pool;