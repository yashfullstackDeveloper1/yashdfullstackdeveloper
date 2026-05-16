const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://scos_db_xt9u_user:BVZsQs7AAG0YwiXGvwknIJ2z9XO4wRKz@dpg-d841c5jtqb8s73et9r10-a.ohio-postgres.render.com/scos_db_xt9u',
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => console.error('❌ Database connection failed:', err));

module.exports = pool;
