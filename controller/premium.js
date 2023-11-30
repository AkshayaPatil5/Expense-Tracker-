const userdetailstable = require('../models/user')

const Razorpay = require('razorpay')

const Order = require('../models/order')

require('dotenv').config();

const purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET})
        const amount = process.env.EX_AMOUNT;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
           
            if (err) {
                console.log("errror")
            }
            Order.create({ orderid: order.id, status: "PENDING" }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch(err => {
                throw new Error(err);
            })
        })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};





const updateTranctionStatus = async (req, res) => {

    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } })
        const promise1 = order.update({ paymentid: payment_id, status: 'successful' }, { where: { orderid: order_id } })
        const promise2 = userdetailstable.update({ ispremiumuser: true }, { where: { id: req.userId.userid } })
        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({ success: true, message: "Transaction successful" });
        }).catch((err) => {
            throw new Error(err)
        })
    } catch (error) {
        throw new Error(error);
    }
};


module.exports = {
    updateTranctionStatus,
    purchasePremium
 }