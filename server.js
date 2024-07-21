require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const corsOptions=require('./config/corsOptions')
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const PORT=process.env.PORT;
app.use(express.json());
const path=require('path');
const connectdb=require(path.join(__dirname,'config','dbConn.js'));
connectdb();
app.use(cookieParser());
app.use(cors(corsOptions));
const verifyJWT=require(path.join(__dirname,"middleware","verifyJWT"));
app.use('/user',require(path.join(__dirname,'routes','api','user.js')));
app.use(verifyJWT);
app.use('/notes',require(path.join(__dirname,'routes','api','notes')));
mongoose.connection.once('open',()=>{
    console.log('connected to db');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
