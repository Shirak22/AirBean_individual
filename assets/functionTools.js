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

function userIdGenerator(username,digits){
    const availableChars = '1234567890ABCDEFGHIJKLMNOPQR';
    const shuffeldUsername = fisherShuffle(username);
    const dateStamp = Date.now().toString().slice(-4);
    const userID = fisherShuffle(availableChars + dateStamp + shuffeldUsername);
    let result = ''; 
    
    for (let i = 0; i < digits; i++) {
        const randomNum = Math.floor(Math.random() * availableChars.length); 
        result += userID[randomNum];
    }

    

    return result;
}

function fisherShuffle(username){
    const arr = username.toString().split(''); 
    for (let x = 0; x < arr.length; x++) {
        let j= Math.floor(Math.random() * x ); //random char in the array 
        let k = arr[x]; // current original char in arr
        arr[x] = arr[j]; // change the original to the random one from array
        arr[j] = k //change the random one we have in array to the current char. 
        //its all about exchanging the places 
    } 
    return arr.join(""); 
}

module.exports = {orderNumberGenerator,userIdGenerator}