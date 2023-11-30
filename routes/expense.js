const express = require('express')

const router = express.Router();

const Controller = require('../controller/expense')

const userauthenticate = require('../middleware/auth')


router.get('/getexpenses', userauthenticate.authenticate, Controller.getExpenses);

router.post('/postexpense', userauthenticate.authenticate, Controller.postExpense);

router.delete(`/deleteexpense/:id`,Controller.deleteExpense);

router.get('/download', userauthenticate.authenticate, Controller.downloadExpenses);

router.get('/leaderboard', userauthenticate.authenticate, Controller.leaderboard);



module.exports = router;
