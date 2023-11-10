const express=require('express');
const app=express();
const path = require('path');
const fs=require('fs');
require('dotenv').config();
const sequelize = require('./util/database');
const expense=require('./model/expensemodel')
const users=require('./model/userdetails')
const order = require('./model/order')
const Forgotpassword = require('./model/forgotpassword');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const cors=require('cors');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const passwordRoutes = require('./routes/resetpassword');
const premiumRoutes = require('./routes/premium');

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),
{flags:'a'}
);

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));

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