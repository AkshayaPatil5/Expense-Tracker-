const express = require('express')

const router = express.Router();

const premiumController = require('../controllers/premium');
const userauthenticate=require('../middleware/auth');


router.get('/purchasepremium', userauthenticate.verifyToken, premiumController.purchasepremium);
router.post('/updatetranctionstatus', userauthenticate.verifyToken, premiumController.updatetranctionstatus);
router.get('/leaderboard', userauthenticate.verifyToken, premiumController.leaderboard);


module.exports = router;