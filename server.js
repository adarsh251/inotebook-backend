require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const PORT=process.env.PORT;
app.use(express.json());
const path=require('path');
const connectdb=require(path.join(__dirname,'config','dbConn.js'));
connectdb();
const register=require(path.join(__dirname,'routes','register.js'));
app.use('/register',register);


mongoose.connection.once('open',()=>{
    console.log('connected to db');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
