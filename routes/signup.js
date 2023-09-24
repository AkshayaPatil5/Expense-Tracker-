// routes/signup.js

const express = require('express');
const router = express.Router();
const signUpController = require('../controllers/signup'); // Your signup controller

// Define a route for user registration
router.post('/add-user', signUpController.addUser);

module.exports = router;

