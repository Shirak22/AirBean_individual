const nedb = require('nedb-promise'); 
const couponDB = new nedb({filename: './database/coupons.db', autoload:true}); 


function addCoupon(coupon){
    if(typeof coupon === 'object'){
        couponDB.insert(coupon); 
    }else {
        return
    }
}


async function findCoupon(coupon){
    const found = await couponDB.findOne({Coupon:coupon}); 
    return found; 
}



module.exports = {addCoupon,findCoupon}; 