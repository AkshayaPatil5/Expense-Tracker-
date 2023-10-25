const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        
        if (!token) {
           
            return res.status(401).json({ success: false, message: 'Authorization token is missing.' });
        }

        const user = jwt.verify(token, 'secretkey');
        console.log('userID >>>> ', user.userId);

        User.findByPk(user.userId).then((user) => {
            if (!user) {
                // User not found in the database.
                return res.status(401).json({ success: false, message: 'User not found.' });
            }

            req.user = user;
            next();
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: 'Authentication failed.' });
    }
};

module.exports = {
    authenticate
};


