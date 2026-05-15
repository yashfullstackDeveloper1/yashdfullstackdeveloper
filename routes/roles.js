const express = require('express');
const router = express.Router();
// import 2 functions from roleController.js
const { createRole, listRoles } = require('../controllers/roleController');

router.post('/', createRole);
router.get('/', listRoles);

module.exports = router;