const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize= require('../util/database');

const isStringInvalid = (string) => string === undefined || string.length === 0;

const signup = async (req, res) => {
  let t;
  try {
    const { name, email, password } = req.body;

    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ error: "Bad parameters. Please provide name, email, and password." });
    }

    
    t = await sequelize.transaction();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

  
    await User.create({ name, email, password: hashedPassword }, { transaction: t });

    
    await t.commit();

    res.status(201).json({ message: 'Successfully created a new user' });
  } catch (err) {
    
    if (t) {
      await t.rollback();
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};


function  generateAccessToken(id,name,ispremiumuser){
 return jwt.sign({ userId: id, name:name, ispremiumuser }, 'secretkey');
}


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ error: 'Email or password is missing', success: false });
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
      const result = await bcrypt.compare(password, user.password);

      if (result) {
        const token = generateAccessToken(user.id,user.name, user.ispremiumuser);
        return res.status(200).json({ success: true, message: "User logged in successfully", token });
      } else {
        return res.status(400).json({ success: false, error: 'Password is incorrect' });
      }
    } else {
      return res.status(404).json({ success: false, error: 'User does not exist' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login,
  generateAccessToken
};



