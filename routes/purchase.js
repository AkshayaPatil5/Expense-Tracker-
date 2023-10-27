const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase');
const userauthentication = require('../middleware/auth'); 

router.get('/premiummembership', userauthentication.authenticate, purchaseController.purchasePremium);
router.post('/updateTransactionstatus', userauthentication.authenticate, purchaseController.updateTransactionStatus);


module.exports = router;