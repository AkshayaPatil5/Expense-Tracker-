
const User = require('../models/user'); 

const addUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
           
            return res.status(400).json({ error: 'User with this email already exists.' });
        }
        const newUser = await User.create({ name, email, password });
        res.status(201).json({ newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
};


module.exports = { addUser };

