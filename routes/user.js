const express = require('express')

const router = express.Router();

const userController = require('../controllers/user');

const userauthenticate=require('../middleware/auth');

router.post('/signup',userController.signupdetails);

router.post('/login',userController.logindetails);


module.exports = router;