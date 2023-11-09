const express = require('express')

const router = express.Router();

const Controller = require('../controllers/controller')
const userauthenticate=require('../middleware/auth')




router.get('/updatepassword/:resetpasswordid', Controller.updatepassword)

router.get('/resetpassword/:id', Controller.resetpassword)

router.use('/forgotpassword', Controller.forgotpassword)

router.get('/download', userauthenticate.verifyToken, Controller.downloadExpenses)



module.exports = router;