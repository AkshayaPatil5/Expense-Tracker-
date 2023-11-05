const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization token is missing.' });
        }

        try {
            const user = jwt.verify(token, process.env.TOKEN_SECRET);
            console.log('userID >>>> ', user.userId);

            User.findByPk(user.userId).then((user) => {
                if (!user) {
                    return res.status(401).json({ success: false, message: 'User not found for the provided token.' });
                }

                req.user = user;
                next();
            });
        } catch (tokenError) {
            console.error(tokenError);
            return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
        }
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: 'Authentication failed.' });
    }
};

module.exports = {
    authenticate
};



