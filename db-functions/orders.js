const nedb = require('nedb-promise'); 
const orderDB = new nedb({filename: './database/orders.db', autoload:true}); 
const offersDB = new nedb({filename: './database/offers.db', autoload:true}); 




function addOrder(order){
    orderDB.insert(order); 
}

async function findOrderByOrderNr(orderNr){
    const order = await orderDB.find({orderNr:orderNr}); 
    return order;
}

async function findOrderByuserId(userId){
    const order = await orderDB.find({userId:userId}); 
    return order;
}

async function findByOfferProduct(id){
    const offer = await offersDB.find({productId:id}); 
    return offer;
}
async function findOfferByProductName(name){
    const offer = await offersDB.find({product:name}); 
    return offer;    
}
 async function addPromotionalOffer(offer){
    // const offer = {
    //     product:'Bryggkaffe',
    //     value:'15%',
    //     expiration:'2d',
    //     timestamp:Date.now()
    // }
    // {offerID}
        offersDB.insert(offer); 

    // if(offer.value.includes('%')){
    //     const index = offer.value.indexOf('%'); 

    //     return parseFloat(offer.value.slice(0,index)/100);
    // }else {
    //     return parseInt(offer.value);
    // }
    }
module.exports = {findOfferByProductName,addOrder,findOrderByOrderNr,findOrderByuserId,addPromotionalOffer,findByOfferProduct}