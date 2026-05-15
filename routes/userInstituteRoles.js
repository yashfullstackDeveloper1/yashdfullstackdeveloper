const express = require('express');
const router = express.Router();
// import 2 functions
const { createMapping, listMappings } = require('../controllers/userInstituteRoleController');

router.post('/', createMapping);
router.get('/', listMappings);

module.exports = router;