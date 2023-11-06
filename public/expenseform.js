const form = document.getElementById('expenseForm');
    const listOfExpensesTable = document.getElementById('listOfExpensesTable');

    form.addEventListener('submit', addNewExpense);

    function addNewExpense(event) {
      event.preventDefault();

      const expenseDetails = {
        amount: document.getElementById('amount').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        timestamp: new Date().toISOString()
      };

      const token = localStorage.getItem('token'); 

      axios.post('http://localhost:3000/expense/addexpense', expenseDetails, {
        headers: { 'Authorization': token }
      })
        .then(response => {
          addNewExpenseToUI(response.data.expense);
        })
        .catch(err => {
          showError(err);
          console.log(err.response.data);
        });
    }

    function addNewExpenseToUI(expense) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${expense.amount}</td>
        <td>${expense.description}</td>
        <td>${expense.category}</td>
        <td>${new Date(expense.timestamp).toDateString()}</td> <!-- Display date -->
        <td><button onclick="deleteExpense(${expense.id})">Delete Expense</button></td>
      `;
      newRow.dataset.id = expense.id;
      listOfExpensesTable.appendChild(newRow);
    }

    function deleteExpense(expenseId) {
      const token = localStorage.getItem('token'); 

      axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseId}`, {
        headers: { 'Authorization': token }
      })
        .then(response => {
          removeExpenseFromUI(expenseId);
        })
        .catch(err => showError(err));
    }

    

    function removeExpenseFromUI(expenseId) {
      const expenseRow = listOfExpensesTable.querySelector(`tr[data-id="${expenseId}"]`);
      if (expenseRow) {
        expenseRow.remove();
      }
    }
 function showPremiumMessage(){

      document.getElementById('premiumMessage').innerHTML = 'You are a premium user';
      document.getElementById('rzp-button').style.visibility = 'hidden';

    }
    function parseJwt (token) {
      if (!token) {
        return null;
      }
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
  }
    function loadExpenses() {
      const token = localStorage.getItem('token');
      const decodeToken=parseJwt(token) 
      console.log(decodeToken)
      //const ispremiumuser=decodeToken.ispremiumuser
      //if(ispremiumuser){
        if (decodeToken && decodeToken.ispremiumuser) {
        showPremiumMessage()

      }
      if (token) {
      axios.get('http://localhost:3000/expense/getexpenses', {
        headers: { 'Authorization': token }
      })
        .then(response => {
          response.data.expenses.forEach(expense => {
            addNewExpenseToUI(expense);
          });
        })
        .catch(err => {
          showError(err);
          console.log(err.response.data); 
        });
    }
  else {
    // Handle the case when token is not available
    showError("Token is not available");
  }
    }

    loadExpenses(); 

    function showLeaderboard() {
      const token = localStorage.getItem('token');
      const decodeToken = parseJwt(token);
      const isPremiumUser = decodeToken.ispremiumuser;
    
      if (isPremiumUser) {
        const inputElement = document.createElement("input");
        inputElement.type = "button";
        inputElement.value = "Show leaderboard";
        inputElement.onclick = async () => {
          try {
            const userLeaderArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', {
              headers: { 'Authorization': token }
            });
            console.log(userLeaderArray);
    
            var leaderboardElem = document.getElementById('leaderboard');
            leaderboardElem.innerHTML = '<h1>Leader Board</h1>';
    
            userLeaderArray.data.forEach((userDetails) => {
              leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalexpenses || 0}</li>`;
              
            });
          } catch (error) {
            console.error("Error fetching leaderboard:", error);
          }
        };
        document.getElementById("premiumMessage").appendChild(inputElement);
      }
    }
    
    showLeaderboard();
    
    function showExpensesByTimeframe(timeframe) {
      const allExpenses = []; // Store all expenses
    
      // Retrieve expenses and add them to 'allExpenses' array
      axios.get('http://localhost:3000/expense/getexpenses', {
        headers: { 'Authorization': token }
      })
      .then(response => {
        allExpenses.push(...response.data.expenses);
    
        // Filter expenses for daily and monthly basis
        const today = new Date();
        if (timeframe === 'daily') {
          const dailyExpenses = allExpenses.filter(expense => {
            const expenseDate = new Date(expense.timestamp);
            return expenseDate.toDateString() === today.toDateString();
          });
          renderExpenses(dailyExpenses);
        } else if (timeframe === 'monthly') {
          const monthlyExpenses = allExpenses.filter(expense => {
            const expenseDate = new Date(expense.timestamp);
            return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear();
          });
          renderExpenses(monthlyExpenses);
        }
      })
      .catch(err => {
        showError(err);
        console.log(err.response.data);
      });
    }
  

    function showError(err) {
      console.error(err);
    }
   
    

    document.getElementById('rzp-button').onclick = async function (e) {
      try {
        const token = localStorage.getItem('token');
    
        if (!token) {
          showError("Token is not available");
          return;
        }
    
        const response = await axios.get('http://localhost:3000/purchase/premiummembership', {
          headers: { 'Authorization': token }
        });
    
        console.log('Response:', response);
    
        var options = {
          "key": response.data.key_id,
          "order_id": response.data.order.id,
          "handler": async function (response) {
            try {
              const updatedTokenResponse = await axios.post(
                'http://localhost:3000/purchase/updatetransactionstatus',
                {
                  order_id: options.order_id,
                  payment_id: response.razorpay_payment_id,
                },
                {
                  headers: { "Authorization": token },
                }
              );
    
              console.log(response);
              alert("You are a Premium User Now");
              document.getElementById('rzp-button').style.visibility = 'hidden';
              document.getElementById('premiumMessage').innerHTML = 'You are a premium user';
    
              localStorage.setItem('token', updatedTokenResponse.data.token);
            } catch (updateError) {
              console.error("Error updating transaction status:", updateError);
              showError("Error updating transaction status");
            }
          }
        };
    
        var rzp = new Razorpay(options);
        rzp.open();
        e.preventDefault();
    
        rzp.on('payment.failed', function (response) {
          console.log(response);
          alert("Something went wrong");
        });
      } catch (error) {
        console.error("Error during premium membership purchase:", error);
        showError("Error during premium membership purchase");
      }
    };
    function renderExpenses(expenses) {
      listOfExpensesTable.innerHTML = ''; // Clear the table
      expenses.forEach(expense => {
        addNewExpenseToUI(expense);
      });
    }
    
    // Example usage:
    // Show daily expenses
    showExpensesByTimeframe('daily');
    
    // Show monthly expenses
    showExpensesByTimeframe('monthly');
     