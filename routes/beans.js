const {Router} = require('express'); 
const router = Router();
const {messages} = require('../errorMessages');
const {writeProductsInDB,getAllProducts} = require('../db-functions/products'); 
const {addOrder,findOrderByOrderNr} = require('../db-functions/orders');
const {addUser,findUser,findUserById,addToUserHistory} = require('../db-functions/user');
const {validateOrdreData,checkProductsExistsInDB,checkUserStatus,totalPrice} = require('../middleware/validate-order-data'); 
const {orderNumberGenerator} = require('../assets/functionTools');
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

router.post('/order', validateOrdreData, checkProductsExistsInDB, checkUserStatus,totalPrice, (req, res) => {

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
        //creating order object with structure
        let order = {
            orderNr: orderNr,
            user: req.body.user,
            userId:req.body.user !== 'GUEST' ? userId : 'GUEST',
            timestamp: timeStamp,
            totalPrice:req.body.totalPrice,
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
                date: new Date(order[0].timestamp).toLocaleDateString(),
                total_price: order[0].totalPrice,
                user:order[0].user,
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
module.exports = router; 

