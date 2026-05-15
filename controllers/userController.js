const pool = require('../config/db');
// use to hash password before saving
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    // get these 5 values from request body that user sends
    const { first_name, last_name, email, mobile, password } = req.body;
    try {
        // join first and last name together
        const full_name = `${first_name} ${last_name}`;
        // cconvert plain password to hashed password
        const password_hash = await bcrypt.hash(password, 10);
        // insert new user into database
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, full_name, email, mobile, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [first_name, last_name, full_name, email, mobile, password_hash]
        );
        // send success response with created user data
        res.json({ success: true, message: 'User created', data: result.rows[0] });
        // If anything wrong  send error message
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// get all users from database and send back
const listUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// share both functions with routes file
module.exports = { createUser, listUsers };