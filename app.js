const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./util/database');
const cors = require('cors');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const forgotpassword = require('./models/forgotpassword');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense'); 
const purchaseRoutes = require('./routes/purchase');
const preiumRoutes = require('./routes/premium');
const forgotPasswordRoutes = require('./routes/resetpassword');
const dotenv = require('dotenv');
const app = express();
dotenv.config()
app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});




app.use('/user', userRoutes);

app.use('/expense', expenseRoutes);

app.use('/purchase', purchaseRoutes);

app.use('/premium', preiumRoutes);

app.use('/password', forgotPasswordRoutes);



User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotpassword);
forgotpassword.belongsTo(User);


sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  
