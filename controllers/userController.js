const {validationResult}=require('express-validator');
const bcrypt = require('bcrypt');
const path=require('path');
const User=require(path.join(__dirname,'..','model','User'));
require('dotenv').config();
const jwt=require('jsonwebtoken');

const handleLogin= async (req,res)=>{
    const result=validationResult(req);
    if(result.isEmpty()){
        try{
            const user=await User.findOne({email:req.body.email}).exec();
            if(!user){
                res.status(401).json({"msg":"email does not exists"});
            }
            else{
                const match=await bcrypt.compare(req.body.password,user.password);
                if(match){
                    //sign token
                    const accessToken=jwt.sign(
                        {
                            "user":{
                                "email":req.body.email,
                                "id":user._id,
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn:'10m',
                        }
                    );
                    res.status(200).json({accessToken});
                }
                else{
                    res.status(401).json({"msg":"Incorrect password"});
                }
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }
    else{
        res.status(404).json(result);
    }
}

const fetchUser= async (req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

const createUser= async (req,res)=>{
    const result=validationResult(req);
    // const arr=JSON.stringify(result);
    // console.log(arr);
    if(result.isEmpty()){
        const user=await User.findOne({email:req.body.email}).exec();
        if(!user){  
            try{
                const salt=await bcrypt.genSalt(10);
                const hashedpwd=await bcrypt.hash(req.body.password,salt);
                await User.create({
                    "user":req.body.user,
                    "email":req.body.email,
                    "password":hashedpwd
                })
                res.status(201).json({"msg":`New user: ${req.body.user} created`});
            }
            catch(err){
                console.log(err);
                res.status(500).send(err);
            }
        }
        else{
            res.status(404).json({"msg":"Email already exists"});
        }
    }
    else{
        res.status(404).json({result});
    }
}
module.exports={handleLogin,fetchUser,createUser};