const {Router} = require('express'); 
const router = Router();
const {writeProductsInDB,getAllProducts,findProductByName} = require('../DBfunctions/products'); 
const {validateOrdreData,checkProductsExistsInDB} = require('../middleware/validateData'); 
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

router.post('/order',validateOrdreData,checkProductsExistsInDB, (req,res)=> {
    //get valid data from user #--

    //check if the products exists in database 

    //check if the user is GUEST or LOGGED IN 
    //generate  unique orderNr 
    //generate timestamp using Date API to track the time and calculate the delivery time
    //creating order object with structure

        // {
        //     orderNr:'45asda654',
        //     userid:'sad4564',
        //     timestamp: '5498978654',
        //     order:[]
        // }
    try{
        res.json({success:true})
    }catch {
        res.json({success:false })
    }
    
    
})


module.exports = router; 

