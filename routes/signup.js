const express = require('express');
const router = express.Router();
const signUpController = require('../controllers/signup');


router.post('/add-user', signUpController.addUser);

module.exports = router;
