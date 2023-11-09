const userdetailstable =require('../model/userdetails')
const expense = require('../model/expensemodel');
const Razorpay = require('razorpay')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Order=require('../model/order')

const AWS=require('aws-sdk');

function uploadToS3(stringfyexpense, filename){
    const BUCKET_NAME =process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY
    const SECRET_KEY = process.env.SECRET_KEY

    const s3Bucket=  new   AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: SECRET_KEY,
        Bucket:BUCKET_NAME
    })
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:stringfyexpense,
            ACL:'public-read'
        }

    return new Promise((resolve, reject)=>{
        s3Bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log("something went wrong")
                reject(err)
            }
            else {
                console.log("sucess", s3response)
                resolve (s3response.Location)
            }
        })
    })
        
    
}


const purchasepremium = async (req, res) => {
    try {
        var rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
        const amount = 2500;
    rzp.orders.create({amount,currency: "INR" },(err, order) => {
          // console.log(order)
            if (err) {
               console.log("it is errror")
            }
        Order.create({ orderid: order.id, status: "PENDING" }).then(()=>{
        return res.status(201).json({ order, key_id: rzp.key_id });
     }).catch (err=>{
        throw new Error(err);
         })
        })    
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updatetranctionstatus = async (req, res) => {
    
    try {
        const { payment_id,order_id } = req.body;
      const order= await Order.findOne({ where: { orderid: order_id } })
        const promise1 = order.update({ paymentid: payment_id, status: 'successful' }, { where: { orderid: order_id } })
        const promise2 = userdetailstable.update({ ispremiumuser: true }, { where: { id: req.userId.userid}})
        Promise.all([promise1,promise2]).then(()=>{
        return res.status(202).json({ success: true, message: "Transaction successful" });
    }).catch((err)=>{
        throw new Error(err)
    })
     } catch (error) {
        throw new Error(error);
    }
};


const leaderboard = async (req, res) => {
    try {
        
        const leaderboardData = await userdetailstable.findAll({
            attributes: ['id', 'Name', 'totalExpenses'],
            order: [['totalExpenses', 'DESC']],
        });

        res.json(leaderboardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};
 
const downloadExpenses = async (req, res) => {
    //     const data= await expense.findAll({ where: { userId: req.userId.userid } })
    //        console.log(data)
    //        const stringfyexpense=JSON.stringify(data)
    //    const userId= req.userId.userid
    //     const filename = `Expense${userId}/${new Date()}.txt`
    //        const fileurl=   await uploadToS3(stringfyexpense,filename)
    //     res.status(201).json({ fileurl, success: true })
    };

module.exports={
    purchasepremium,
    updatetranctionstatus,
    leaderboard,
    downloadExpenses
}