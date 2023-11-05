
const name = document.getElementById('name')
const email = document.getElementById('email')
const password = document.getElementById('password')
const form = document.getElementById('signup-form')
const details = document.getElementById('details')
form.addEventListener('submit' , signUp)

async function signUp (e){

e.preventDefault();
  const obj = {
    name : name.value,
    email : email.value,
    password : password.value
  }
  try
  {
    let user = await axios.post(`http://localhost:3000/user/signup` , obj)
    console.log(user.ispremiumuser)
    localStorage.setItem('ispremiumuser' ,false)
     name.value  = "",
     email.value = "",
     password.value = "" ,
     window.location.href = "./login.html"
    
    }catch(err){
    console.log(err);
   
  }
}