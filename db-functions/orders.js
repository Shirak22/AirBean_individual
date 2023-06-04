const nedb = require('nedb-promise'); 
const orderDB = new nedb({filename: './database/orders.db', autoload:true}); 




function addOrder(order){
    orderDB.insert(order); 
}

async function findOrderByOrderNr(orderNr){
    const order = orderDB.find({orderNr:orderNr}); 
    return order;
}

async function findOrderByuserId(userId){
    const order = orderDB.find({userId:userId}); 
    return order;
}
module.exports = {addOrder,findOrderByOrderNr,findOrderByuserId}