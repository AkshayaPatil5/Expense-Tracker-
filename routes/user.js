const express = require('express')

const router = express.Router();

const userController = require('../controller/user')
const userauthenticate = require('../middleware/auth');


router.post('/signup', userController.signupDetails)
router.post('/login', userController.loginDetails)
router.get('/get-new-token',userauthenticate.authenticate,userController.updateToken)


module.exports = router;