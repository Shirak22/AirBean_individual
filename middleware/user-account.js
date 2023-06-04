const {messages} = require('../errorMessages');
const {addUser,findUser,updateStatus,findUserById} = require('../db-functions/user');
const {addOrder,findOrderByOrderNr,findOrderByuserId} = require('../db-functions/orders');
const {orderNumberGenerator,convertTimestamp,convertTimeToMillis} = require('../assets/functionTools');

const {hashedCheck,hashPassword} = require('../assets/crypting'); 

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

async function userAuth(req,res,next){
    const username = req.body?.username.toLowerCase();
    const password = req.body?.password; 
    const dbUser = await findUser(username);
    
        if(!dbUser){
            res.status(400).json({success:false, message:"Access denied! "})
        }else {
            const correctPass = await hashedCheck(password,dbUser.password);
            if(correctPass){
                updateStatus(dbUser.userId,true);
                next(); 
            }else {
            res.status(400).json({success:false, message:"Access denied!"})

            }
        }
            

}

async function logOut(req,res,next){
    const user = req.body?.username;
    const dbUser = await findUser(user);
    if(!dbUser){
        res.status(400).json({success:false, message:"No such user"})
    }else if(!dbUser.islogged){
        res.status(400).json({success:false, message:"Your are already logged out! "})

    }else  {
        updateStatus(dbUser.userId,false);
        next();
    }
    
    
}


async function userIdCheck(req,res,next){
    const userId = req.body?.userId;
        let response = {
            success:false,
            message:'You should log in to contiue!  '
        }
        if(userId){
            const user = await findUserById(userId);
            if(user && user.islogged){
                const orders = await findOrderByuserId(userId);
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
                    user:user.username,
                    all_orders:orders
                }
                res.json(response);
            }else if(user && !user.islogged){
                res.json(response);
            }else {
                res.status(404).json(messages.notFound);
            }
          
        }else {
            res.status(404).json(messages.notFound);
        }
}


module.exports = {checkUserdata,usernameExistence,userAuth,logOut,userIdCheck}; 