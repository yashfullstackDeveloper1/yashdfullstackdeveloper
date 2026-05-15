const pool = require('../config/db');

const createMapping = async (req, res) => {
    // get 5 values from request body:
    const { tenant_id, user_id, institute_id, role_id, is_primary } = req.body;
    try {
        // Insert mapping into database
        const result = await pool.query(
            `INSERT INTO user_institute_roles (tenant_id, user_id, institute_id, role_id, is_primary)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [tenant_id, user_id, institute_id, role_id, is_primary]
        );
        res.json({ success: true, message: 'Mapping created', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const listMappings = async (req, res) => {
    try {
        //  get all mappings from database and send back
        const result = await pool.query('SELECT * FROM user_institute_roles');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createMapping, listMappings };