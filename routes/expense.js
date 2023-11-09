const express = require('express')

const router = express.Router();

const expenseController = require('../controllers/expense');
const userauthenticate=require('../middleware/auth');

router.delete(`/deleteexpense/:id`,expenseController.deleteexpense);
router.get('/getexpenses', userauthenticate.verifyToken, expenseController.getexpense)
router.put(`/editexpense/:id`, expenseController.putexpense);
router.post('/postexpense', userauthenticate.verifyToken,expenseController.postexpense);

module.exports = router;
