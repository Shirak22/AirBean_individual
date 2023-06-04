const bcrypt = require('bcrypt');

async function hashPassword(password){
    const hashed = bcrypt.hash(password,10); 
    return hashed;
}





async function hashedCheck(password,hashedPassword){
    const match = await bcrypt.compare(password,hashedPassword);
    return match; 
}


module.exports = {hashedCheck,hashPassword}