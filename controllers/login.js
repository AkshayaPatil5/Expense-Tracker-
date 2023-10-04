const User = require('../models/user');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await User.findOne({ where: { email, password } });

        if (user) {
            
            res.status(200).json({ user });
        } else {
            
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
};

module.exports = {
    loginUser
};
