const express = require('express'); 
const app = express();
const port = 3000; 

const {messages} = require('./errorMessages');

app.use(express.json()); 
const userRoutes = require('./routes/user'); 
const mainRoutes = require('./routes/main'); 
const beansRoutes = require('./routes/beans'); 

//all user routes  
app.use('/api/user', userRoutes);
app.use('/api/beans', beansRoutes);

//all main routes  
app.use('/', mainRoutes); 


//not found pages 
app.all('*',(req,res)=> {
     res.json(messages.badrequest);
})











app.listen(port,()=> console.log('The server is live on port: ' + port)); 

