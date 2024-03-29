const {messages} = require('../errorMessages');
const {findUser} = require('../db-functions/user');
const {findOrderByuserId} = require('../db-functions/orders');
const {convertTimestamp} = require('../assets/functionTools');
const {hashedCheck} = require('../assets/crypting'); 
const jwt = require('jsonwebtoken'); 

function checkUserdata(req,res,next){
    const body = req.body;

    const passwordPattern = /[0-9]+\w+/g; 
    if(body.hasOwnProperty('username') && body.hasOwnProperty('password') ){
        if(body.password.length > 3 && passwordPattern.test(body.password)){
            next(); 
        }else {
            res.status(400).json({success:false, message: 'The password length is less then 3 '}); 
        }
       
    } else{
        res.status(400).json(messages.badrequest); 
    }
    
}   

async function usernameExistence(req,res,next){
    const user = await findUser(req.body.username.toLowerCase());
        if(!user){
            next();
        }else {

            res.status(400).json(Object.assign(messages.badrequest,{fix:'the username is taken, please try another one! '}));
        }
}

async function userAuth(req, res, next) {
    const username = req.body?.username.toLowerCase();
    const password = req.body?.password;
    const dbUser = await findUser(username);

    if (!dbUser) {
        res.status(400).json({ success: false, message: "Access denied! " })
    } else {
        const correctPass = await hashedCheck(password, dbUser.password);
        if (correctPass) {
            const token = jwt.sign({ username: dbUser.username }, 'a1b1c1d1', {
                expiresIn: '1h'
            });
            req.token = token; 
            next();
        } else {
            res.status(400).json({ success: false, message: "Access denied!" })
        }
    }


}

async function secureRoute(req,res,next){
    const token = req.headers.authorization?.replace('Bearer ', '');
    if(!token ){
        res.status(403).json({success:false, message: 'token is required! '}); 
    }else {
        try{
            const {username} = await jwt.verify(token, 'a1b1c1d1'); 
            
            const checkuser = await findUser(username); 
            if(checkuser){
                let sendData = {
                    username:checkuser.username,
                } 
                req.user = sendData;
                next(); 
            }else {
                res.status(403).json({success:false, message:'the token is expired'}); 
            }
        }catch {
            res.status(400).json({success:false, message:'Please log in first! '}); 
        }
    }
   
}

async function adminCheck(req, res, next) {
    const username = await req.user?.username;
    const user = await findUser(username); 
    if (user.role === 'admin') {
        console.log(user.role);
        next();
    } else if (user.role === 'user') {
        console.log(user.role);
        res.status(401).json(Object.assign(messages.badrequest,{user_message:'You don\'t have permission to access! you need to have {role:admin} to access!'}));
    }else{
        console.log(user.role);
        res.status(401).json(messages.badrequest);
    }

}
   
async function userIdCheck(req,res,next){
    const username = req.user.username; 
    
    const user= await findUser(username)// req.user?.userId;
        let response = {
            success:false,
            message:'You should log in to contiue!  '
        }
            if(user.userId){
                const orders = await findOrderByuserId(user.userId);
                orders.map(order => {
                    let deliveryTime = order.estimated_delivery; 
                    order.estimated_delivery = convertTimestamp('date',order.timestamp + deliveryTime) + ',' + convertTimestamp('time',order.timestamp + deliveryTime);
                    order.order_status =  (Date.now() -  (order.timestamp + deliveryTime)) > 0 ? 'The order deliverd! ' : ' On its way' ,
                    delete order._id;
                    delete order.timestamp;
                    delete order.user;
                    delete order.userId;
                })
                 response = {
                    success:true,
                    user:username,
                    all_orders:orders
                }
                res.json(response);
            }else {
                res.status(404).json(messages.notFound);
            }
}


module.exports = {checkUserdata,usernameExistence,userAuth,userIdCheck,secureRoute,adminCheck}; 