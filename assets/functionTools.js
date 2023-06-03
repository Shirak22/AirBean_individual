function orderNumberGenerator(digits){
    const availableChars = '1234567890ABCDEFGHIJKLMNOPQR';
    const dateStamp = Date.now().toString().slice(-4); 
    let result = ''; 
    for (let i = 0; i < digits; i++) {
        const randomNum = Math.floor(Math.random() * availableChars.length); 
        result += availableChars[randomNum];
    }
    return result + dateStamp;
}



module.exports = {orderNumberGenerator}