const express = require('express');
const router = express.Router();
// import 2 functions from userController.js
const { createUser, listUsers } = require('../controllers/userController');
// when someone sends POST /users → run createUser function
router.post('/', createUser);
router.get('/', listUsers);

module.exports = router;