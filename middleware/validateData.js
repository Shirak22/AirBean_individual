
const {messages} = require('../errorMessages');
const {writeProductsInDB,getAllProducts,findProductByName} = require('../DBfunctions/products'); 


function validateOrdreData(req,res,next){
    let body = req.body; 
    if(body.hasOwnProperty('details') && body.details.hasOwnProperty('order') ){
        if(Array.isArray(body.details.order)){
            next();
        }else {
            res.status(400).json({error:messages.badrequest,fix:'order property must be an array'}); 
        }
    }else {
        res.status(400).json({error:messages.badrequest,fix:'The request must include details property'}); 
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



module.exports = {validateOrdreData,checkProductsExistsInDB};

