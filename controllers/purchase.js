const Order = require('../models/orders');
const Razorpay = require('razorpay');
const userController = require('../controllers/user');

const purchasePremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const amount = 2500;

    const order = await new Promise((resolve, reject) => {
      rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
        if (err) {
          reject(new Error(JSON.stringify(err)));
        } else {
          resolve(order);
        }
      });
    });

    await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
    return res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: err.message, message: 'Something went wrong' });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;

    const order = await Order.findOne({ where: { orderid: order_id } });
    await Promise.all([
      order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }),
      req.user.update({ ispremiumuser: true })
    ]);

    return res.status(202).json({ success: true, message: 'Transaction successful', token: userController.generateAccessToken(userId, undefined, true)});
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message, message: 'Something went wrong' });
  }
};

module.exports = {
  purchasePremium,
  updateTransactionStatus
};

