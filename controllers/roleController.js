// import database connection
const pool = require('../config/db');

const createRole = async (req, res) => {
    // get 3 values from request body
    const { name, code, description } = req.body;
    try {
        // Insert new role into database
        const result = await pool.query(
            `INSERT INTO roles (name, code, description)
       VALUES ($1, $2, $3) RETURNING *`,
            [name, code, description]
        );
        res.json({ success: true, message: 'Role created', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// get all roles from database and send back
const listRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roles');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createRole, listRoles };