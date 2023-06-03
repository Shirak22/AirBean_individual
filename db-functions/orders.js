const nedb = require('nedb-promise'); 
const orderDB = new nedb({filename: './database/orders.db', autoload:true}); 




function addOrder(order){
    orderDB.insert(order); 
}

async function findOrderByOrderNr(orderNr){
    const order = orderDB.find({orderNr:orderNr}); 
    return order;
}
module.exports = {addOrder,findOrderByOrderNr}