// controllers/signup.js

const User = require('../models/user'); // Your Sequelize User model

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create a new user in the database
    const newUser = await User.create({ name, email, password });

    res.status(201).json({ newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
};

module.exports = { addUser };

