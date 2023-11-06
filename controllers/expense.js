const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize= require('../util/database');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');

const addExpense = async (req, res) => {
    try {
        const t = await sequelize.transaction();

        const { amount, description, category } = req.body;
        console.log('Request body:', req.body);

        if (amount === undefined || description === undefined || category === undefined) {
            return res.status(400).json({ success: false, message: 'Parameters missing' });
        }

        const expense = await Expense.create(
            { amount, description, category, userId: req.user.id },
            { transaction: t }
        );

        const totalexpenses = Number(req.user.totalexpenses) + Number(amount);
        console.log(totalexpenses);

        await User.update(
            { totalexpenses: totalexpenses },
            { where: { id: req.user.id }, transaction: t }
        );

        await t.commit();
        return res.status(201).json({ success: true, expense });
    } catch (err) {
        if (t) {
            await t.rollback();
        }
        console.error(err);
        return res.status(500).json({ success: false, error: err.message || 'Operation failed' });
    }
};


const getExpenses = async (req, res) => {
    try {
        const expenses = await req.user.getExpenses();
        return res.status(200).json({ success: true, expenses });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Failed to fetch expenses' });
    }
};

exports.downloadExpenses = async (req ,res)=>{
    try{
      const user = await User.findByPk(req.user.userId)
      const expenses = await user.getExpenses();
      const stringifyExpenses = JSON.stringify(expenses);
      const filename = `Expense${user.id}/${new Date()}.txt`;
       const fileUrl = await uploadToS3(stringifyExpenses, filename);
      //  console.log(fileUrl)
         DowHistory.History(fileUrl , user.id)
      res.status(200).json({fileUrl , success : true});
    }catch(err){
      res.status(500).json({fileUrl : '' , success : false});
    }
  }
  


const deleteExpense = async (req, res) => {
    const expenseId = req.params.expenseid;

    if (expenseId === undefined || expenseId.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid parameters' });
    }

    try {
        
        const expense = await Expense.findOne({
            where: { id: expenseId, userId: req.user.id }
        });

        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense doesn't belong to the user" });
        }

        const amountToDelete = expense.amount;

        
        const t = await sequelize.transaction();

        
        await Expense.destroy({ where: { id: expenseId, userId: req.user.id }, transaction: t });

        
        const updatedTotalExpenses = Number(req.user.totalexpenses) - Number(amountToDelete);
        await User.update(
            { totalexpenses: updatedTotalExpenses },
            { where: { id: req.user.id }, transaction: t }
        );

        
        await t.commit();

        return res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    } catch (err) {
        console.error(err);
        if (t) {
            await t.rollback();
        }
        return res.status(500).json({ success: false, error: 'Failed to delete expense' });
    }
};


module.exports = {
    deleteExpense,
    getExpenses,
    addExpense,
    downloadExpenses
};

