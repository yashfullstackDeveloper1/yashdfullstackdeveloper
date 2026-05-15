// Import JWT package to verify tokens
const jwt = require('jsonwebtoken');

// Create a function called verifyToken
const verifyToken = (req, res, next) => {
    // Get the token from request header
    const authHeader = req.headers['authorization'];
    // Extract only the token part make it big
    const token = authHeader && authHeader.split(' ')[1];

    // if no token found send error message back
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    // this check the token is real or not or expire save user info from token allow request to continue to API 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } 
    // If token is fake or expired send error message
    catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};
// it will use by all files 
module.exports = verifyToken;