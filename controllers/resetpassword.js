require('dotenv').config();
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Forgotpassword = require('../models/forgotpassword');
const Brevo = require('sib-api-v3-sdk');
      
const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey='SG.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';

console.log(apiKey.apiKey)
const apiInstance = new Brevo.TransactionalEmailsApi();
exports.forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user)
        {
            const id = uuid.v4();
           console.log(id);
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                   res.status(202).json({message : "password  not able to reset something went wrong "})
                })
                
               
                
              //  console.log(id)
                console.log(email)
             apiInstance.sendTransacEmail({
                   sender: { email: 'patilakshaya427@gmail.com',name:'Akshaya' },
                   subject: 'To forgot you passoword',
                   htmlContent: `<!DOCTYPE html><html><body><h1>My Heading</h1><p>My first paragraph.</p><a href="http://localhost:9000/password/resetpassword/${id}">Reset password</a></body></html>`,
                
                   to: [
                      {
                         email:`${email}`,
                         name: 'ayush'
                      }
                   ]
                 })
                 .then(function(data) {
                //    console.log('API called successfully. Returned data: ' + data);
                   console.log(data);
                   return res.status(202).json({message: 'Link to reset password sent to your mail ', sucess: true})
                 })
                 .catch(function(error) {
                    console.log('here')
                    console.error(error);
                    return res.json({ message: error, sucess: false });
                });
            }else{
                      console.log('here2')
                      res.status(500).json(err);
                    } 
                }catch(err){
        console.log('here3')
      res.status(500).json(err);
    }

}

exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    // console.log(id);
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        console.log(forgotpasswordrequest)
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

exports.updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}