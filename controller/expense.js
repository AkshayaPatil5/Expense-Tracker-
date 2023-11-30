const userdetailstable = require('../models/user')
const expense = require('../models/expense');
const download=require('../models/downloadfile');
const AWS = require('aws-sdk');
const { configDotenv } = require('dotenv');

function uploadToS3(stringfyexpense, filename) {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY
    const SECRET_KEY = process.env.SECRET_KEY

    const s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: SECRET_KEY,
        Bucket: BUCKET_NAME
    })
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: stringfyexpense,
        ACL: 'public-read'
    }

    
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log("something went wrong")
                reject(err)
            }
            else {
                resolve(s3response.Location)
            }
        })
    })


}


const getExpenses = (req, res) => {
    expense.findAll({ where: { userId: req.userId.userid } })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
};

const postExpense = async (req, res, next) => {
    try {
        const amount = parseInt(req.body.amount, 10)
        const description = req.body.description;
        const catogary = req.body.catogary;
        const userId = req.userId.userid;
       
        const newExpense = await expense.create({
            amount,
            description,
            catogary,
            userId,
        });
        
        const user = await userdetailstable.findByPk(userId);
        if (user) {
            if (user.totalExpenses === null) {
                user.totalExpenses = amount;
            } else {
                user.totalExpenses += amount; 
            }
            await user.save();
        }

        res.json(newExpense);
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};


const deleteExpense = (req, res) => {
    const id = req.params.id;

    expense.findByPk(id)
        .then(data => {
            if (!data) {
                
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
    const data = await expense.findAll({ where: { userId: req.userId.userid } });
    const stringfyexpense = JSON.stringify(data);
    const userId = req.userId.userid;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileurl = await uploadToS3(stringfyexpense, filename);

    console.log(fileurl);
    
    const newFile = await download.create({
        fileurl,
        userId: userId 
    });

    res.status(201).json({ fileurl, success: true });
};


module.exports={
    getExpenses,
    postExpense,
    deleteExpense,
    downloadExpenses,
    leaderboard,

}