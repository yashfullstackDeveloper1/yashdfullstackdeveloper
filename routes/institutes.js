const express = require('express');
const router = express.Router();
// import 2 functions from instituteController.js
const { createInstitute, listInstitutes } = require('../controllers/instituteController');
// when someone sends POST /institutes → run createInstitute
router.post('/', createInstitute);
// if get then run list institutes
router.get('/', listInstitutes);

module.exports = router;