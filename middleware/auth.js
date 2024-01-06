const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const userdata = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = userdata;
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid token' });
    }
};

module.exports={
    verifyToken
}