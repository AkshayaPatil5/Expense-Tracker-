const Expense = require('../models/expense');

const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const newExpense = await Expense.create({
      amount,
      description,
      category,
    });
    res.status(201).json({ newExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while adding the expense.' });
  }
};

const getExpenses = async (req, res) => {
  try {
   
    const expenses = await Expense.findAll();
    res.status(200).json({ allExpenses: expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error' });
  }
};


const deleteExpense = async (req, res) => {
    try {
      const expenseId = req.params.id;
      const expense = await Expense.findByPk(expenseId);
  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  await expense.destroy();
  res.status(200).json({ message: 'Expense deleted successfully' });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Error while deleting the expense.' });
}
};

module.exports ={
  addExpense,
  getExpenses,
  deleteExpense

}