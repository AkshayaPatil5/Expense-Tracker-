const express=require('express');
const app=express();
const path = require('path');
require('dotenv').config();
const sequelize = require('./util/database');
const expense=require('./model/expensemodel')
const users=require('./model/userdetails')
const order = require('./model/order')
const Forgotpassword = require('./model/forgotpassword');

const cors=require('cors');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const passwordRoutes = require('./routes/resetpassword');
const premiumRoutes = require('./routes/premium');

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'view')));


app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/password',passwordRoutes);
app.use('/premium',premiumRoutes);


expense.belongsTo(users, { foreignKey: 'userId' });
users.hasMany(expense, { foreignKey: 'userId' });
order.belongsTo(users)

users.hasMany(Forgotpassword);
Forgotpassword.belongsTo(users);


sequelize.sync({})
    .then((result) => {

        app.listen(4000);
    })
    .catch((err) => {
        console.log(err);
    })