const Expense = require('../models/expenses');
const User = require('../models/users');


const addExpense = (req, res) => {
    const { amount, description, category } = req.body;
    console.log('Request body:', req.body);

    if (amount === undefined || description === undefined || category === undefined) {
        return res.status(400).json({ success: false, message: 'Parameters missing' });
    }

    Expense.create({ amount, description, category, userId: req.user.id })
        .then(expense => {
            const totalexpenses = Number(req.user.totalexpenses) + Number(amount);
            console.log(totalexpenses);
            User.update(
                { totalexpenses: totalexpenses },
                { where: { id: req.user.id } }
            )
                .then(() => {
                    return res.status(201).json({ success: true, expense });
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({ success: false, error: 'Failed to update total expenses for the user' });
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Failed to create expense' });
        });
};

const getExpenses = (req, res) => {
    req.user
        .getExpenses()
        .then(expenses => {
            return res.status(200).json({ success: true, expenses });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Failed to fetch expenses' });
        });
};


const deleteExpense = (req, res) => {
    const expenseId = req.params.expenseid;
    console.log("expenseId = ",req.params.expenseid)

    if (expenseId === undefined || expenseId.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid parameters' });
    }

    Expense.destroy({ where: { id: expenseId, userId: req.user.id } })
        .then(noOfRows => {
            if (noOfRows === 0) {
                return res.status(404).json({ success: false, message: "Expense doesn't belong to the user" });
            }
            return res.status(200).json({ success: true, message: 'Expense deleted successfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Failed to delete expense' });
        });
        
};

module.exports = {
    deleteExpense,
    getExpenses,
    addExpense
};

