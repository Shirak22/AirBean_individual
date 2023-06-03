const nedb = require('nedb-promise'); 
const usersDB = new nedb({filename: './database/users.db', autoload:true});


function addUser(username,password){
    let credentials = {
         username:username,
         password:password,
         timeStamp: Date.now()
    }
    usersDB.insert(credentials); 
}

async function findUser(username){
    usersDB.findOne(username); 
}



module.exports = {addUser,findUser};