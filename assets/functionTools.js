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
        let j= Math.floor(Math.random() * x ); //random place in the array 
        let k = arr[x]; // current original char in arr
        arr[x] = arr[j]; // change the original to the random one from array
        arr[j] = k //change the random one we have in array to the current place. 
        //its all about exchanging the places 
    } 
    return arr.join(""); 
}



// converting the time stamp to date or local time 
function convertTimestamp(dateOrTime,timestamp){
    let date = new Date(timestamp);
    let hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`; 
    let minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`; 
    let seconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`; 
    let time = `${hours}:${minutes}:${seconds}`;

    if(dateOrTime === 'date'){
       return  date.toLocaleDateString(); 
    }else if(dateOrTime === 'time'){
        return time; 
    }else {
        return 
    }
}

//converting time to milliseconds 
function convertTimeToMillis(time,value){
    if(time === 'day'){
        return value * 24*60*60*1000; 
    }else if(time === 'hours'){
        return value * 60*60*1000;
    }else if(time === 'minutes'){
        return value *60*1000;
    }else {
        return ; 
    }
}

module.exports = {orderNumberGenerator,userIdGenerator,convertTimestamp,convertTimeToMillis,fisherShuffle}