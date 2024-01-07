
require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./util/database');
const cors = require('cors');
const path = require('path');


const expense = require('./model/expensemodel')
const users = require('./model/userdetails')
const order = require('./model/order')
const Forgotpassword = require('./model/forgotpassword');



const mainpageroute = require('./routes/mainpageroute')
const user = require('./routes/user')
const expenseroute = require('./routes/expense')
const purchase = require('./routes/purchase')
const resetpassword = require('./routes/resetpassword')


app.use(cors())
app.use(express.json())


app.use(express.static(path.join(__dirname, 'public')));


app.use(mainpageroute)
app.use('/user', user)
app.use('/expense', expenseroute)
app.use('/purchase', purchase)
app.use('/password', resetpassword)


users.hasMany(expense);
expense.belongsTo(users);

users.hasMany(order);
order.belongsTo(users);

users.hasMany(Forgotpassword);
Forgotpassword.belongsTo(users);


sequelize.sync({})

    .then((result) => {

        app.listen(process.env.DB_PORT);
    })
    .catch((err) => {
        console.log(err);
    })