const {Router} = require('express'); 
const router = Router();
const {messages} = require('../errorMessages');
const {writeProductsInDB,getAllProducts} = require('../db-functions/products'); 
const {addOrder,findOrderByOrderNr} = require('../db-functions/orders');
const {addUser,findUser,findUserById,addToUserHistory} = require('../db-functions/user');
const {addCoupon,findCoupon} = require('../db-functions/coupon');
const {validateOrdreData,checkProductsExistsInDB,checkUserStatus,totalPrice,checkCoupons} = require('../middleware/validate-order-data'); 
const {orderNumberGenerator,convertTimestamp,convertTimeToMillis,fisherShuffle} = require('../assets/functionTools');
//BEANS ROUTES



router.get('/', async (req, res) => {
    //fetch from json and write in db
    await writeProductsInDB();
    const products = await getAllProducts();
    let response = {
        success: true,
        menu: products
    }

    res.json(response);
    //view in json format on this route 
});

router.post('/order', validateOrdreData, checkProductsExistsInDB, checkUserStatus,totalPrice,checkCoupons, (req, res) => {

    try {
        const orderDate = new Date();
        const userId = req.body.details.userId;
        //get valid data from user #--
        //check if the products exists in database #--
        //check if the user is GUEST or LOGGED IN  #--
        //generate  unique orderNr #--
        const orderNr = orderNumberGenerator(6);
        //generate timestamp using Date API to track the time and calculate the delivery time #--
        const timeStamp = Date.now();
        //adding estimated delivery time #--
        //check if there is any coupons,
        let order = {
            orderNr: orderNr,
            userId:req.body.user !== 'GUEST' ? userId : 'GUEST',
            coupon:req.body.details.coupon,
            totalPrice:req.body.totalPrice,
            discountValue:req.body.details.coupon.value,
            discountPrice:(req.body.totalPrice * req.body.details.coupon.value/100), 
            date: convertTimestamp('date',timeStamp),
            estimated_delivery: convertTimeToMillis('minutes',1), //the random number here is  range between 5 and 1 minute
            timestamp: timeStamp,
            order:req.body.details.order
        }

        let orderToHistory = {
            orderNr: orderNr,
            order_date: orderDate.toLocaleDateString()
        }

        // {
        //     orderNr:'45asda654',
        //     userid:'sad4564',
        //     timestamp: '5498978654',
        //     order:[]
        // }
        //writing the order to the database orders.db #--
        addToUserHistory(userId,orderToHistory);
        addOrder(order);

        res.json({ success: true, order: orderToHistory });
    } catch {
        res.json({ success: false,message:'something wrong happened! '});
    }


});

router.get('/order/status/:ordernr',async (req,res)=> {
    const orderNr = req.params.ordernr;


    try{
        const order = await findOrderByOrderNr(orderNr); 
        if(order.length > 0){
            let setOrder = {
                orderNr:orderNr,
                date: convertTimestamp('date',order[0].timestamp),
                order_placed:convertTimestamp('time',order[0].timestamp),
                //convertTimestamp() converts time stamps to a readable date or time 
                Estimated_Delivery: convertTimestamp('date',order[0].timestamp + order[0].estimated_delivery) + ' , ' + convertTimestamp('time',order[0].timestamp + order[0].estimated_delivery),
                //returns status based on the diff between the time now and the time order placed, 
                order_status : (Date.now() -  (order[0].timestamp + order[0].estimated_delivery)) > 0 ? 'The order deliverd! ' : ' On its way' ,
                total_price: order[0].totalPrice,
                //if discountPrice exists it will output a price based on the value of the coupon
                // final_price: !order[0].discountPrice ? order[0].totalPrice.toFixed(2) : parseFloat((order[0].totalPrice - order[0].discountPrice).toFixed(2)),
                coupon:(order[0].discountValue ? order[0].discountValue : '0') + '%',
                discount: (order[0].discountPrice ? order[0].discountPrice : '0') + ':-',
                final_price: order[0].discountPrice && (Date.now() -  (order[0].timestamp + order[0].estimated_delivery)) ? parseFloat((order[0].totalPrice - order[0].discountPrice).toFixed(2)) : parseFloat(order[0].totalPrice.toFixed(2)),
                userId:order[0].userId,
                order:order[0].order
            }
            res.json(setOrder);
        }else {
            res.status(404).json({success:false,message:'order not found!'}); 
        }
    }catch {
        res.status(400).json(messages.badrequest);
    }
    
});


router.get('/coupon',(req,res)=> {
    const yourCoupon = fisherShuffle(orderNumberGenerator(4));
    const value = Math.floor(Math.random() * 40 + 10) // random value between 10 and 50
    const expired = Math.floor(Math.random() * 3 + 1); 
    let coupon = {
        Coupon:yourCoupon,
        value:value,
        timestamp: Date.now(),
        expireDays:expired,
        expires: convertTimestamp('date', Date.now() + convertTimeToMillis('day',expired)) // get the expire date by adding the dateOf expiration day to the date coupon generated. 
    }
    addCoupon(coupon); 
    res.json(coupon);
})

router.get('/checkcoupon/:id' , async (req,res)=> {
    const coupon = req.params?.id; 
    const found = await findCoupon(coupon);
    if(found){
        res.json(found);
    }else {
     res.status(400).json(messages.badrequest);
    }
})

module.exports = router; 

