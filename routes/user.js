const {Router} = require('express'); 
const router = Router();
const {hashedCheck,hashPassword} = require('../assets/crypting'); 

const {userIdGenerator} = require('../assets/functionTools');
const {checkUserdata,usernameExistence}=require('../middleware/user-account')



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
        //save the user in users.db
        
    res.json({request:password});
});


module.exports = router; 

