const User = require('../models/user'); 
const bcrypt = require('bcrypt');

const addUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({ name, email, password: hashedPassword });
        
        res.status(201).json({ newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error in creating the user.' });
    }
};


module.exports = { addUser };

