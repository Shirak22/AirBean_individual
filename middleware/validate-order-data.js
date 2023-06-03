
const {messages} = require('../errorMessages');
const {orderNumberGenerator} = require('../assets/functionTools');

const {writeProductsInDB,getAllProducts,findProductByName} = require('../db-functions/products'); 


function validateOrdreData(req,res,next){
    let body = req.body; 
    if(body.hasOwnProperty('details') && body.details.hasOwnProperty('order') ){
        if(Array.isArray(body.details.order)){
            next();
        }else {
            res.status(400).json({error:messages.badrequest,fix:'order property must be an array'}); 
        }
    }else {
        res.status(400).json({error:messages.badrequest,fix:'The request must include details:{order:[]} property'}); 
    }
}

async function checkProductsExistsInDB(req,res,next){
    const products = await getAllProducts(); // imports  product from DB 
    const orders = req.body?.details?.order;  // requested order from user if exists 
    let productNames = [];//array of names to be rendered in json format when error occurs
    let checkNameUndefined = false; 
    let checkPriceUndefined = false; 


    products.forEach(product => {productNames.push(product.title)});

    //looping throw the orders and check if matches with products in products DB  
     orders && orders.forEach(order => {
            const orderNameMatch  = products.find(product => product.title === order.name);
            const orderPriceMatch  = products.find(product => product.title === order.name && product.price === order.price);
                //orderMatch = undefined if not exists or it return the whole object.
                //it checks if any of the order products requested from the user does exists in DB if not it make the checkNameUndefined true 
                if(!orderNameMatch){
                    checkNameUndefined = true;
                    
                }else if(!orderPriceMatch) {
                    checkPriceUndefined = true; 
                }
    });


    if(checkNameUndefined){
        res.json({
                    success:false,
                    error: 'No such product in our database  ',
                    productsAvailable: productNames.join(',') 
                });
    }else if(checkPriceUndefined){
        res.json({
                    success:false,
                    error: 'Please don\'t change the price! '
                });
    }else {
        next();
    }
   
}

async function checkUserStatus(req,res,next){
    const userStatus = req.body?.details.status; 
    
    //to be updated when creating log in system 
    //make if condition to check if the user exists and is logged in 
    const userInDB = "Shirak";
        if(!userInDB){   //checking if the user is undefind or if not logged In it will be a guest 
            req.body.user = "GUEST"
        }else if(userInDB) {//otherwise it will be logged in and the order will be added to the user account object in DB 
            req.body.user = userInDB;
        }
    next();


}


module.exports = {validateOrdreData,checkProductsExistsInDB,checkUserStatus};

