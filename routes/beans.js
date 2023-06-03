const {Router} = require('express'); 
const router = Router();
const {messages} = require('../errorMessages');
const {writeProductsInDB,getAllProducts,findProductByName} = require('../db-functions/products'); 
const {addOrder,findOrderByOrderNr} = require('../db-functions/orders'); 
const {validateOrdreData,checkProductsExistsInDB,checkUserStatus} = require('../middleware/validate-order-data'); 
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

router.post('/order', validateOrdreData, checkProductsExistsInDB, checkUserStatus, (req, res) => {

    try {
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
            timestamp: timeStamp,
            order: req.body.details.order
        }
        // {
        //     orderNr:'45asda654',
        //     userid:'sad4564',
        //     timestamp: '5498978654',
        //     order:[]
        // }

        //writing the order to the database orders.db 
        addOrder(order);
        res.json({ success: true, order: order });
    } catch {
        res.json({ success: false })
    }


});

router.get('/order/status/:ordernr',async (req,res)=> {
    const orderNr = req.params.ordernr;
    
    try{
        const order = await findOrderByOrderNr(orderNr); 
        if(order.length > 0){
            res.json(order);
        }else {
            res.status(404).json({success:false,message:'order not found!'}); 
        }
    }catch {
        res.status(400).json(messages.badrequest);
    }
    
});
module.exports = router; 

