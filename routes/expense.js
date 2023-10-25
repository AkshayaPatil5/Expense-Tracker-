const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense');
const userauthentication = require('../middleware/auth'); 

router.post('/addexpense', userauthentication.authenticate, expenseController.addExpense);
router.get('/getexpenses', userauthentication.authenticate, expenseController.getExpenses);
router.delete('/deleteexpense/:expenseid', userauthentication.authenticate, expenseController.deleteExpense);

module.exports = router;

