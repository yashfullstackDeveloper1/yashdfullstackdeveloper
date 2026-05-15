const pool = require('../config/db');

const createInstitute = async (req, res) => {
    //  open the request and take out these 4 values
    const { tenant_id, name, code, type } = req.body;
    try {
        // send comand to database to save new institute
        const result = await pool.query(
            `INSERT INTO institutes (tenant_id, name, code, type)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [tenant_id, name, code, type]
        );
        // send the success responce 
        res.json({ success: true, message: 'Institute created', data: result.rows[0] });
        // tell error is their  
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// Get all institutes from database
const listInstitutes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM institutes');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createInstitute, listInstitutes };