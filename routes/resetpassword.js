const express = require('express')

const router = express.Router();
const passController = require('../controllers/resetpassword')
const userauthenticate=require('../middleware/auth')


router.get('/updatepassword/:resetpasswordid', passController.updatepassword);

router.get('/resetpassword/:id', passController.resetpassword);

router.use('/forgotpassword', passController.forgotpassword);

module.exports = router;