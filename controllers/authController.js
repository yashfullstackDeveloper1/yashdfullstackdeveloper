const pool = require('../config/db');
// to check password
const bcrypt = require('bcrypt');
// to create tokens
const jwt = require('jsonwebtoken');

// Get email and password from request body (what user sends from Postman or frontend)
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Search database for user with this email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );
        const user = result.rows[0];

        // Name not in register "Invalid credentials"
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // If they don't match "Wrong password!"
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create a temporary token with user info
        const preToken = jwt.sign(
            { user_id: user.id, email: user.email, token_type: 'pre_context' },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        // Send back token and user info to frontend
        res.json({
            success: true,
            message: 'Login successful',
            pre_context_token: preToken,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email
            }
        });
        // if not error
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getMyInstitutesRoles = async (req, res) => {
    // Get user_id from token (middleware already verified it)
    const user_id = req.user.user_id;
    // Get all institutes and roles for this user from database
    try {
        const result = await pool.query(`
      SELECT 
        uir.tenant_id,
        uir.institute_id,
        i.name as institute_name,
        i.image_url as institute_image,
        uir.role_id,
        r.name as role_name
      FROM user_institute_roles uir
      JOIN institutes i ON i.id = uir.institute_id
      JOIN roles r ON r.id = uir.role_id
      WHERE uir.user_id = $1 AND uir.status = 'active'
    `, [user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No institute associated with this user'
            });
        }

        // Group roles under each institute
        const grouped = {};
        result.rows.forEach(row => {
            if (!grouped[row.institute_id]) {
                grouped[row.institute_id] = {
                    tenant_id: row.tenant_id,
                    institute_id: row.institute_id,
                    institute_name: row.institute_name,
                    institute_image: row.institute_image,
                    roles: []
                };
            }
            grouped[row.institute_id].roles.push({
                role_id: row.role_id,
                role_name: row.role_name
            });
        });

        res.json({ success: true, data: Object.values(grouped) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Create final access token with full info
const selectContext = async (req, res) => {
    const { tenant_id, institute_id, role_id } = req.body;
    const user_id = req.user.user_id;
    try {
        const accessToken = jwt.sign(
            { user_id, tenant_id, institute_id, role_id, token_type: 'access' },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.json({
            success: true,
            access_token: accessToken,
            selected_context: { tenant_id, institute_id, role_id }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// send logout success message
const logout = (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};

// Return current logged in user info from token
const me = (req, res) => {
    res.json({ success: true, data: req.user });
};

// Share all functions with routes files
module.exports = { login, getMyInstitutesRoles, selectContext, logout, me };