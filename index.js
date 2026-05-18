const express = require('express');
const pool = require('./config/db');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Setup database tables
app.get('/setup-db', async (req, res) => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS tenants (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(100) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS institutes (
        id BIGSERIAL PRIMARY KEY,
        tenant_id BIGINT,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(100) UNIQUE NOT NULL,
        type VARCHAR(100) NOT NULL,
        image_url TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        full_name VARCHAR(200),
        email VARCHAR(255) UNIQUE NOT NULL,
        mobile VARCHAR(20),
        password_hash TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS roles (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS user_institute_roles (
        id BIGSERIAL PRIMARY KEY,
        tenant_id BIGINT,
        institute_id BIGINT,
        user_id BIGINT,
        role_id BIGINT,
        is_primary BOOLEAN DEFAULT false,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    res.json({ success: true, message: 'All tables created successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Seed data
app.get('/seed-data', async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO tenants (name, code, status)
      VALUES ('Young Engineers Lab', 'YEL', 'active')
      ON CONFLICT (code) DO NOTHING
    `);
    await pool.query(`
      INSERT INTO institutes (tenant_id, name, code, type, status) VALUES
      (1, 'Young Engineers Lab Nagpur', 'YEL-NGP', 'training_centre', 'active'),
      (1, 'GNIET Nagpur', 'GNIET-NGP', 'college', 'active'),
      (1, 'Young Engineers Lab Pune', 'YEL-PNE', 'training_centre', 'active'),
      (1, 'Young Engineers Lab Mumbai', 'YEL-MUM', 'training_centre', 'active'),
      (1, 'RCOEM Nagpur', 'RCOEM-NGP', 'college', 'active')
      ON CONFLICT (code) DO NOTHING
    `);
    await pool.query(`
      INSERT INTO roles (name, code) VALUES
      ('Super Admin', 'super_admin'),
      ('Institute Admin', 'institute_admin'),
      ('Trainer', 'trainer'),
      ('Student', 'student'),
      ('Parent', 'parent'),
      ('Staff', 'staff')
      ON CONFLICT (code) DO NOTHING
    `);
    res.json({ success: true, message: 'Seed data inserted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fix mappings
app.get('/fix-mappings', async (req, res) => {
  try {
    await pool.query('DELETE FROM user_institute_roles');

    // ayushn - 1 institute + 1 role (Admin)
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 1, 2, 2, true)`);

    // divyanshu - 1 institute + 2 roles (Admin + Trainer)
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 1, 3, 2, true)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 1, 3, 3, false)`);

    // yashd - 5 institutes + 3 roles each (Admin + Trainer + Student)
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 1, 4, 2, true)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 1, 4, 3, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 1, 4, 4, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 2, 4, 2, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 2, 4, 3, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 2, 4, 4, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 3, 4, 2, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 3, 4, 3, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 3, 4, 4, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 4, 4, 2, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 4, 4, 3, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 4, 4, 4, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 5, 4, 2, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 5, 4, 3, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 5, 4, 4, false)`);

    // ayushl - 3 institutes + 2 roles each (Admin + Trainer)
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 1, 5, 2, true)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 1, 5, 3, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 2, 5, 2, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 2, 5, 3, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 3, 5, 2, false)`);
    await pool.query(`INSERT INTO user_institute_roles (tenant_id, institute_id, user_id, role_id, is_primary) VALUES (1, 3, 5, 3, false)`);

    res.json({ success: true, message: 'All mappings fixed!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/institutes', require('./routes/institutes'));
app.use('/roles', require('./routes/roles'));
app.use('/user-institute-roles', require('./routes/userInstituteRoles'));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'SCOS Server is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
