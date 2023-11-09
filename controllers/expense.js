const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const Sequelize = require('sequelize');
const userdetailstable =require('../model/userdetails')
const expense = require('../model/expensemodel');
const Razorpay = require('razorpay')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Order=require('../model/order')
const Forgotpassword = require('../model/forgotpassword');
const AWS=require('aws-sdk');




const getexpense = (req, res) => {
    console.log('expense data send');
    console.log(req.userId.userid)
    expense.findAll({ where: { userId: req.userId.userid } })
        .then((result) => {
             res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
};

const postexpense = async (req, res, next) => {
    try {
        const amount = parseInt(req.body.amount, 10)
        const description = req.body.description;
        const catogary = req.body.catogary;
        const userId = req.userId.userid;
        // Create a new expense
        const newExpense = await expense.create({
            amount,
            description,
            catogary,
            userId,
        });
        // Update the totalExpenses column in the users table
        const user = await userdetailstable.findByPk(userId);
        if (user) {
            if (user.totalExpenses === null) {
                user.totalExpenses = amount;
            } else {
                user.totalExpenses += amount; // Add the new expense amount
            }
            await user.save();
        }

        res.json(newExpense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};


const putexpense = (req, res) => {
    console.log('expense updated');
    const id = req.params.id;
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category
    expense.findByPk(id)
        .then(updated => {
            updated.amount = amount;
            updated.description = description;
            updated.category = category;
            return updated.save();
        })
        .then(updateddata => {
            res.json(updateddata);
        })
        .catch(err => console.log(err));
}

const deleteexpense = (req, res) => {
    console.log('row deleted');
    const id = req.params.id;

    expense.findByPk(id)
        .then(data => {
            if (!data) {
                // Handle the case where the record with the specified ID was not found.
                return res.status(404).send('Expense not found');
            }

            return data.destroy()
                .then(() => {
                    res.send('Successfully deleted');
                })
        })
        .catch(err => {
            res.status(500).send('Internal Server Error');
        });
}


module.exports={

    deleteexpense,
    putexpense,
    postexpense,
    getexpense,
   
}

