const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URL,{
     useNewUrlParser:true
}).then((result)=>{
     console.log('Connection success ' + result )
}).catch((error)=>{
     console.log('connection failed ' + error)
})
