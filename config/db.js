const mongoose = require('mongoose');
const connectionUrl="mongodb+srv://sameer:dangi@cluster0.qeaiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connection=async()=>{
    
        await mongoose.connect(connectionUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
  
}




module.exports = connection;