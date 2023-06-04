const {Router} = require('express'); 
const router = Router();
const {addUser,findUser} = require('../db-functions/user');
const {hashPassword} = require('../assets/crypting'); 

const {userIdGenerator} = require('../assets/functionTools');
const {checkUserdata,usernameExistence,userAuth,logOut,userIdCheck}=require('../middleware/user-account')



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
            let user = {
                userId: userId,
                username:req.body.username.toLowerCase(),
                password:password,
                islogged:false,
                userHistory:[]
            }

            
        //save the user in users.db
        addUser(user);
        
    res.json(user);
});

router.post('/login',checkUserdata,userAuth, async(req,res)=> {
    res.json({success:true, message:"You are logged in!"});
}); 

router.post('/logout',logOut, (req,res)=> {
    res.json({success:true, message:"You are logged out!"});
})

router.post('/history',userIdCheck,(req,res)=> {
    res.sendStatus(200); 
}); 

module.exports = router; 

