const {Router} = require('express'); 
const router = Router();
const jwt = require('jsonwebtoken'); 

const {addUser,findUser,find} = require('../db-functions/user');
const {hashPassword} = require('../assets/crypting'); 

const {userIdGenerator} = require('../assets/functionTools');
const {checkUserdata,usernameExistence,userAuth,userIdCheck,secureRoute}=require('../middleware/user-account');
const { messages } = require('../errorMessages');



router.get('/',(req,res)=> {
    res.status(200).json({message: "Please log in or signup! "});
});


router.post('/signup',checkUserdata,usernameExistence,async (req,res)=> {
        //check user data input {username, password } #---
        //check if the username exists in the database #---
        //generate Unique userID #---
        const userId= userIdGenerator(req.body.username,10); //generating user id based on date and username. 
        //hash the password using bcryptjs
        const password = await hashPassword(req.body.password);
        //checking if there is no users in the database that means the first user is the admin. 

        const checkAdmin = await find({}); 
            let user = {
                userId: userId,
                username:req.body.username.toLowerCase(),
                password:password,
                role: checkAdmin.length !== 0 ? 'user': 'admin'
            }
   
        //save the user in users.db
        try{
            addUser(user);
            res.json(user);
        }catch {
            res.status(400).json(messages.badrequest); 
        }
    
});

router.post('/login',checkUserdata,userAuth, async(req,res)=> {
            res.status(200).json({success:true, token:req.token, message:'You logged in ! '});
}); 

router.get('/history',secureRoute,userIdCheck,(req,res)=> {
    res.sendStatus(200); 
}); 

module.exports = router; 

