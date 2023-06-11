const nedb = require('nedb-promise'); 
const db = new nedb({filename: './database/products.db', autoload:true}); 

const products = require('../json/menu.json'); 

//all function related to the available products
async function writeProductsInDB(){
    const {menu} = products;
    const dbContent = await db.find({});
    //check if products.db exists or is empty to fill it with prioducts once;
    if(dbContent == null || dbContent.length == 0){
        menu.forEach((product)=> {
            db.insert(product);
        })
    }else {
        return
    }

}

async function getAllProducts(){
    const dbContent = await db.find({});
    return dbContent; 
}

async function findProductByName(productName){
   const result = await db.findOne({title:productName}); 
    return result ;
}

async function findProductById(productId){
    const result = await db.findOne({id:productId}); 
     return result ;
 }

async function removeProduct(productId){
    db.remove({id:productId}, {})
}
function addProduct(product){
        db.insert(product); 
}
async function updateProduct(productId, newData){
    await db.update({id:productId}, {$set:newData}); 
}
module.exports = {addProduct,writeProductsInDB,getAllProducts,findProductByName,findProductById,updateProduct,removeProduct};