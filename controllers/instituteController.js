const pool = require('../config/db');

const createInstitute = async (req, res) => {
  const { tenant_id, name, code, type, image_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO institutes (tenant_id, name, code, type, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [tenant_id, name, code, type, image_url]
    );
    res.json({ success: true, message: 'Institute created', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const listInstitutes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM institutes');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createInstitute, listInstitutes };