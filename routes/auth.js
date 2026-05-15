const express = require('express');
// create a server just for auth routes
const router = express.Router();
// import tocken verification from middleware
const verifyToken = require('../middleware/auth');
// Import all 5 functions from authController.js
const {
    login,
    getMyInstitutesRoles,
    selectContext,
    logout,
    me
} = require('../controllers/authController');

// when someone send POST /auth/login → run login function
router.post('/login', login);
// when someone send GET /auth/my-institutes-roles
router.get('/my-institutes-roles', verifyToken, getMyInstitutesRoles);
router.post('/select-context', verifyToken, selectContext);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, me);
// it shares this route with index.js file
module.exports = router;