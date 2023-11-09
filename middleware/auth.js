const jwt = require('jsonwebtoken');
const secretKey = "98789d8cedf2f9a86af5391e930337cfe11ffc64ef0140fa8989920e2034a307494d74fe50bd5c7e3f137e56c7da3999309264ae5c29b54937c72f6c27563f28";
const userdetails = require('../model/userdetails');

const verifyToken = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, "98789d8cedf2f9a86af5391e930337cfe11ffc64ef0140fa8989920e2034a307494d74fe50bd5c7e3f137e56c7da3999309264ae5c29b54937c72f6c27563f28");

        // Set userId property in the request
        req.userId = user;

        // Continue with the next middleware
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid token' });
    }
};

module.exports={
    verifyToken
}

