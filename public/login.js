const email = document.getElementById('email')
const password = document.getElementById('password')
const form = document.getElementById('login-form')
const details = document.getElementById('details')
const forgotPass = document.getElementById('forgotPassword')

// eventListner
form.addEventListener('submit' , addData)
forgotPass.addEventListener('click',()=>window.location.href = './forgotpassword.html') 

async function addData (e){
  e.preventDefault();
  try{
let obj = {
  email : email.value,
  password : password.value
}


  let response = await axios.post('http://localhost:3000/user/login' , obj);
  const token = response.data.token;
  console.log(token);
  email.value = "",
  password.value = "" 
  localStorage.setItem('token' ,token);
  window.location.href = './expenseform.html'
 
}catch(err){
  console.log(err.response.data.message);
}
 } 