const express = require('express');

const passwordController = require('../controller/password');

const router = express.Router();

router.get('/updatepassword/:resetpasswordid', passwordController.updatePassword)

router.get('/resetpassword/:id', passwordController.resetPassword)

router.use('/forgotpassword', passwordController.forgotPassword)

module.exports = router;