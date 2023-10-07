const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

router.post('/login-user', loginController.loginUser);

module.exports = router;
