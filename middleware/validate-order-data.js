
const {messages} = require('../errorMessages');
const {findUser} = require('../db-functions/user');
const {getAllProducts,findProductById} = require('../db-functions/products');
const {addOrder,findOrderByOrderNr,addPromotionalOffer,findByOfferProduct,findOfferByProductName} = require('../db-functions/orders');

const jwt = require('jsonwebtoken'); 
const { numberGenerator, convertTimestamp, convertTimeToMillis } = require('../assets/functionTools');


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
                    error: 'No such product in our database',
                    productsAvailable: productNames.join(',') 
                });
         checkNameUndefined = false;
    }else if(checkPriceUndefined){
        res.json({
                    success:false,
                    error: 'Please don\'t change the price! '
                });
        checkPriceUndefined = false; 
    }else {
        next();
    }
   
}

// async function checkUserStatus(req,res,next){
//     const userIdByUser = req.body?.details?.userId; 
//     const user = await findUserById(userIdByUser); 

//         if(user && user.islogged){
//             req.body.user = user.username;
//             next(); 
//         }else {
//             req.body.user = "GUEST"; 
//             next(); 
//         }
async function checkUserStatus(req,res,next){
    const token = req.headers.authorization?.replace('Bearer ', '');

        if(token){
            try{
                const {username} = await jwt.verify(token, 'a1b1c1d1'); 
                const checkuser = await findUser(username); 
                    req.user = checkuser;
                    next(); 
            
            
            }catch {
                req.user = {userId:'GUEST'}
                next();
            }
        }else  {
            req.user = {userId:'GUEST'}
            res.status(400).json({success:false, message:'Please log in first! '}); 
        }
            
        }
 


        
//         //to check if the user exists and is logged in 
// }

async function totalPrice(req, res, next) {
    let orders = req.body.details.order;
    let totalPrice = 0;
  
    const ordersAfterOffer = await Promise.all(
      orders.map(async (order) => {
        const foundOffer = await findOfferByProductName(order.name);
        let priceAfterDiscount = order.price;
        if (foundOffer.length > 0) {
          foundOffer.forEach((offer) => {
            if (Date.now() < offer.expire_timestamp) {
              let value = offer.value; // '10'  or '10%' 
                if(value.includes('%')){
                    const index = value.indexOf('%'); 
                    let newValue = parseFloat(value.slice(0,index))/100; 
                    priceAfterDiscount = order.price - (order.price * newValue );
                    console.log(newValue);
                }else if(order.price > parseInt(value)){
                    priceAfterDiscount = order.price - parseInt(value);
                }else {
                    priceAfterDiscount = 0
                }
                
            }
          });
        }
  
        return {
          name: order.name,
          price: priceAfterDiscount,
        };
      })
    );
  
    ordersAfterOffer.forEach((order) => {
      totalPrice += parseInt(order.price);
    });
  
    req.body.totalPrice = totalPrice;
    console.log(totalPrice);
    next();
  }



function validateOffer(req,res,next){
    const offer =  req.body?.offer;
        if(offer){
            const productId = req.body.offer?.productId; 
            const value = req.body.offer?.value; 
            const expires= req.body.offer?.expires; 

                if(productId && value && expires){
                    next(); 
                }else {
                    res.status(400).json({success:false,message:'Please make sure you have right input! '})
                }
        }else {
            res.status(400).json({success:false,message:'Please make sure you have right input! '})

        }
}

async function addOffer(req,res,next){
    const {productId,value,expires} = req.body.offer; 
    //expire time is string  '2,days' => 2 days  ||  '2,hours' => 2 hours
    const splitExpires = expires.split(','); 

    const foundOffer = await findByOfferProduct(productId);
    const foundProduct = await findProductById(productId); 


    if(foundProduct){
        let newOfferData={
            id:numberGenerator(10),
            product:foundProduct.title,
            productId:foundProduct.id,
            value:value,
            createdAt:convertTimestamp('date',Date.now()) + ',' + convertTimestamp('time',Date.now()),
            expires:expires,
            expire_date: convertTimestamp('date',(Date.now() + convertTimeToMillis(splitExpires[1] === 'days' ? 'day':'hours',parseInt(splitExpires[0])))),
            expire_time: convertTimestamp('time',(Date.now() + convertTimeToMillis(splitExpires[1] === 'days' ? 'day':'hours',parseInt(splitExpires[0])))),
            timestamp:Date.now(),
            
            //expired date is the the time stamp now in millis add to the expires date from the user converted to millis too 
            expire_timestamp : Date.now() + convertTimeToMillis(splitExpires[1] === 'd' ? 'day':'hours',parseInt(splitExpires[0]))
        }
    
        if(foundOffer.length > 0){
            foundOffer.forEach( async (offer)=> {
               //if(expired) {add offer } else {res.json({message:"There is active offer on this product! "})} 
    
               //check if the offer expired! 
               if(Date.now() > offer.expire_timestamp){
                await addPromotionalOffer(newOfferData);
                  res.json(newOfferData); 
               }else {
                    res.json({success:false, message:'There is an active offer on the same product! '})
               }
            });
        }else {
           //add offer next(); 
           await addPromotionalOffer(newOfferData);
           res.json(newOfferData); 
        }
    }else {
        res.status(404).json({success:false, message:'No such product! '});

    }   

    
  
        
}

module.exports = {addOffer,validateOffer,validateOrdreData,checkProductsExistsInDB,checkUserStatus,totalPrice};

// async function totalPrice(req, res, next) {
//     let orders = req.body.details.order;
//     let totalPrice = 0;
  
//     const ordersAfterOffer = await Promise.all(
//       orders.map(async (order) => {
//         const foundOffer = await findOfferByProductName(order.name);
//         let priceAfterDiscount = order.price;
//         if (foundOffer.length > 0) {
//           foundOffer.forEach((offer) => {
//             if (Date.now() < offer.expire_timestamp) {
//               priceAfterDiscount = order.price - parseInt(offer.value);
//             }
//           });
//         }
  
//         return {
//           name: order.name,
//           price: priceAfterDiscount,
//         };
//       })
//     );
  
//     ordersAfterOffer.forEach((order) => {
//       totalPrice += parseInt(order.price);
//     });
  
//     req.body.totalPrice = totalPrice;
//     console.log(totalPrice);
//     next();
//   }