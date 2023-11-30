const express = require('express')

const router = express.Router();

const premiumController = require('../controller/premium');

const userauthenticate = require('../middleware/auth')


router.get('/purchasepremium', userauthenticate.authenticate, premiumController.purchasePremium);

router.post('/updatetranctionstatus', userauthenticate.authenticate, premiumController.updateTranctionStatus);



module.exports = router;