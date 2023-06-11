const {messages} = require('../errorMessages');
const {addUser,findUser,updateStatus,findUserById} = require('../db-functions/user');
const {addOrder,findOrderByOrderNr,findOrderByuserId} = require('../db-functions/orders');
const {numberGenerator,convertTimestamp,convertTimeToMillis} = require('../assets/functionTools');
const {writeProductsInDB,getAllProducts,findProductByName} = require('../db-functions/products'); 

const jwt = require('jsonwebtoken'); 
const {hashedCheck,hashPassword} = require('../assets/crypting'); 




function validateData(req,res,next){
        const product = req.body?.product; 
        if(product) {
                const name = product?.name; 
                const desc = product?.description; 
                const price = product?.price;
                if(name && desc && price ) {
                        next();
                }else {
                        res.status(400).json(Object.assign(messages.badrequest, {note:'Please make sure you have this structure {product: {name , description,price} } '}))
                }
        }else {
                res.status(400).json(Object.assign(messages.badrequest, {note:'Product property is missing'}))
        }
}

async function checkProductExistence(req,res,next){
        const inputProductName = req.body.product.name; 
        const found = await findProductByName(inputProductName); 
                if(found){
                        res.status(409).json({success:false, message:'The product is already exist! '})
                }else {
                        next();
                }

}


module.exports = {validateData,checkProductExistence}; 
