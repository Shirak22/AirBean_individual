const {Router} = require('express'); 
const router = Router();
const {messages} = require('../errorMessages');
const {secureRoute,adminCheck}=require('../middleware/user-account'); 
const {validateData,checkProductExistence}=require('../middleware/products-validation'); 
const {addOffer,validateOffer}=require('../middleware/validate-order-data'); 
const {numberGenerator,convertTimestamp} = require('../assets/functionTools');
const {addProduct,findProductByName,findProductById,updateProduct,removeProduct} = require('../db-functions/products'); 
const {addOrder,findOrderByOrderNr,addPromotionalOffer} = require('../db-functions/orders');


router.get('/',secureRoute, (req,res)=> {
    res.status(200).json({success:true,username:req.user?.username});
})


router.post('/addproduct',secureRoute,validateData,adminCheck,checkProductExistence, async (req,res)=> {
    const {name,description,price} = await req.body.product; 

    let product = {
            id:"coffee-" + numberGenerator(10), 
            title:name,
            desc:description,
            price:price,
            createdAt:convertTimestamp('date',Date.now()) +','+ convertTimestamp('time',Date.now()),
            timestamp: Date.now()
    }

    addProduct(product);
    res.status(200).json({success:true,message: product.title + ' has been add successfuly'});
})

router.put('/editproduct/:productId', secureRoute, validateData, adminCheck, async (req, res) => {
    const productId = req.params?.productId;
    const userRequest = req.body.product;
    const found = await findProductById(productId);

    if (found) {
        let product = {
            id: found.id,
            title: userRequest.name,
            desc: userRequest.description,
            price: userRequest.price,
            createdAt: found.createdAt ? found.createdAt : 'No data',
            modifiedAt: convertTimestamp('date', Date.now()) + ',' + convertTimestamp('time', Date.now()),
            timestamp: Date.now()
        }

        const productNameFound = await findProductByName(userRequest.name);
        if (productNameFound && productNameFound.id !== productId) {
            res.status(409).json({ success: false, message: 'Product name already exist! ' });
        } else {
            await updateProduct(productId,product);
            res.status(200).json({ success: true, message: product.title + ' has been edited successfuly', product: product });
        }

    } else {
        res.status(404).json({ success: false, message: 'The product not found! ' });
    }

});

router.delete('/removeproduct/:productId', secureRoute, adminCheck, async (req, res) => {
    const productId = req.params?.productId;
    const found = await findProductById(productId);
    if(found){
        await removeProduct(productId);
        res.json({success:true,message:'The product has been removed successfuly!'}); 
    }else {
    res.status(404).json({success:false, message:'The product not found!'});
    }
})

router.post('/addPromotionalOffer',secureRoute,adminCheck,validateOffer,addOffer,async (req,res)=> {
    // res.json({message:'Pass final destination!'});
}); 
module.exports = router; 

