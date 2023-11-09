const email=document.getElementById('email')
        console.log(email);
        const form=document.getElementById('form')
        console.log(form)
        form.addEventListener('submit',postemail)

        function postemail(e){
            e.preventDefault()
            const email=e.target.email.value
           const useremail={
            email:email
           }
    const res =axios.post('http://localhost:4000/password/forgotpassword',useremail)
    .then(response => {
                if (response.status === 202) {
                    document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
                } else {
                    throw new Error('Something went wrong!!!')
                }
            }).catch(err => {
                document.body.innerHTML += `<div style="color:red;">${err} <div>`;
            })
    
}