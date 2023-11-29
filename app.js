require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');
const sequelize = require('./util/database');
const helmet = require('helmet')
const fs = require('fs');
const path = require('path');


//models
const expense = require('./models/expense')
const users = require('./models/user')
const order = require('./models/order')
const Forgotpassword = require('./models/password');
const report= require('./models/downloadfile');

//routes
const userRoutes = require('./routes/user')
const expenseRoutes= require('./routes/expense')
const purchaseRoutes = require('./routes/premium')
const resetpassword = require('./routes/password')


const errorLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' });

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'view')));


app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/forgotpasswaord', resetpassword);


app.use((err, req, res, next) => {
    errorLogStream.write(`${new Date().toISOString()} - ${err.stack}\n`);
    res.status(500).send('Something failed!');
});


expense.belongsTo(users, { foreignKey: 'userId' });
users.hasMany(expense, { foreignKey: 'userId' });

order.belongsTo(users);

users.hasMany(Forgotpassword);
Forgotpassword.belongsTo(users);
 
users.hasMany(report);
report.belongsTo(users);


sequelize.sync({})
    .then((result) => {

        app.listen(process.env.DB_PORT);
    })
    .catch((err) => {
        errorLogStream.write(`${new Date().toISOString()} - Database Sync Error: ${err.stack}\n`);
        console.log('Error syncing the database:', err);
    })