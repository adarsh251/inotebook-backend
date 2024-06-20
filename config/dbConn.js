const mongoose = require('mongoose');
const connectdb=async()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URI);
    }catch(err){
        console.log('Error connecting to database');
        console.log(err);
    }
}
module.exports=connectdb;