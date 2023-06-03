const {messages} = require('../errorMessages');
const {addUser,findUser} = require('../db-functions/user');

function checkUserdata(req,res,next){
    const body = req.body;

    const passwordPattern = /[0-9]+\w+/g; 
    if(body.hasOwnProperty('username') && body.hasOwnProperty('password') ){
        if(body.password.length > 3 && passwordPattern.test(body.password)){
            next(); 
        }else {
            res.status(400).json({success:false, message: 'The password length is less then 3 '}); 
        }
       
    } else  {
        res.status(400).json(messages.badrequest); 
    }
    
}   


async function usernameExistence(req,res,next){
    const {username}= req.body; 
    const user = await findUser(username);
        if(!user){
            next();
        }else {
            res.status(400).json(messages.badrequest);
        }
}

module.exports = {checkUserdata,usernameExistence}; 