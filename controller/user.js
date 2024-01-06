const userdetailstable = require('../model/userdetails')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



function genrateAcesstoken(id, ispremiumuser) {
    return jwt.sign({ userid: id, ispremiumuser: ispremiumuser }, process.env.TOKEN_SECRET)
}


const usergethomePage = (request, response, next) => {
    response.sendFile('expense.html', { root: 'view' });
}

const logindetails = async (req, res,) => {
    const { email, password } = req.body;
    try {
        const user = await userdetailstable.findOne({ where: { Email: email } });

        if (user) {

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = genrateAcesstoken(user.id, user.ispremiumuser);

                return res.json({ success: true, message: 'Login successful', token: token });
            } else {

                return res.json({ success: false, message: 'Incorrect password' });
            }
        } else {
            return res.json({ success: false, message: 'User not found' });
        }
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
}


const signupdetails = async (req, res, next) => {
    try {
        const Name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const existingUser = await userdetailstable.findOne({ where: { Email: email } });
        if (existingUser == null) {
            const userinfo = await userdetailstable.create({ Name: Name, Email: email, password: hashedPassword });
            return res.json({ success: true, message: 'Account created successfully' });
        }
        else {
            return res.json({ success: false, message: 'This Account already exists' });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const updatetoken = async (req, res) => {
    const token = req.header('Authorization');

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await userdetailstable.findOne({ where: { id: decodedToken.userid } });

        if (user.ispremiumuser) {
            const newToken = genrateAcesstoken(user.id, user.ispremiumuser);

            return res.json({ success: true, message: 'token updated', token: newToken });
        } else {
            return res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};


module.exports={
    signupdetails,
    logindetails,
    usergethomePage,
    updatetoken
}