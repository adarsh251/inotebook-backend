require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const PORT=process.env.PORT;
const path=require('path');
const connectdb=require(path.join(__dirname,'config','dbConn.js'));
connectdb();
mongoose.connection.once('open',()=>{
    console.log('connected to db');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
