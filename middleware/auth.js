const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, process.env.TOKEN_SECRET);

        req.userId = user;
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid token' });
    }
};

module.exports={
    authenticate
}