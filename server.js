const express = require('express'); 
const app = express();
const port = 3000; 
const {messages} = require('./errorMessages');

app.use(express.json()); 
// app.use((req, res, next) => {
// 	console.log(`${req.method}  ${req.url} `, req.body)
// 	next()
// })


const userRoutes = require('./routes/user'); 
const beansRoutes = require('./routes/beans'); 
const adminRoutes = require('./routes/admin'); 

//all user routes  
app.use('/api/user', userRoutes);
app.use('/api/beans', beansRoutes);

//admin route
app.use('/api/admin', adminRoutes);


//not found pages 
app.all('*',(req,res)=> {
     res.status(404).json(messages.notFound);
})











app.listen(port,()=> console.log('The server is live on port: ' + port)); 

