const nedb = require('nedb-promise'); 
const usersDB = new nedb({filename: './database/users.db', autoload:true});


function addUser(user){
   
    usersDB.insert(user); 
}

async function findUser(username){
    const result = usersDB.findOne({username:username}); 
    return result;
}

async function findUserById(userId){
    const result = usersDB.findOne({userId:userId}); 
    return result;
}
async function updateStatus(userId,status){
    await usersDB.update({userId:userId}, {$set:{ islogged:status }}); 
}

async function addToUserHistory(userId,order){
    await usersDB.update({userId:userId}, {$push:{userHistory:order}}); 
}
module.exports = {addUser,findUser,updateStatus,findUserById,addToUserHistory};