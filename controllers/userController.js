const {validationResult}=require('express-validator');
const bcrypt = require('bcrypt');
const path=require('path');
const User=require(path.join(__dirname,'..','model','User'));
require('dotenv').config();
const jwt=require('jsonwebtoken');

const handleLogin= async (req,res)=>{
    const result=validationResult(req);
    //console.log(req);
    if(result.isEmpty()){
        try{
            const foundUser=await User.findOne({email:req.body.email}).exec();
            if(!foundUser){
                res.status(401).json({"msg":"email does not exists"});
            }
            else{
                const match=await bcrypt.compare(req.body.password,foundUser.password);
                if(match){
                    //sign token
                    const accessToken=jwt.sign(
                        {
                            "user":{
                                "email":req.body.email,
                                "id":foundUser._id,
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn:'10m',
                        }
                    );
                    const refreshToken=jwt.sign(
                        {"id":foundUser._id},
                        process.env.REFRESH_TOKEN_SECRET,
                        {expiresIn: '1d'}
                    )
                    const name=foundUser.user;
                    //console.log(name);
                    foundUser.refreshToken=refreshToken;
                    const result=await foundUser.save();
                    //console.log(result);
                    res.cookie('jwt',refreshToken,{httpOnly:true,maxAge:24*60*60*1000});//secure:true, httpOnly:true in production
                    const cookie=res.cookie;
                    //console.log(cookie);
                    res.json({name, accessToken});
                    //res.sendStatus(200);
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
        console.log(result.errors[0].msg);
        res.status(404).json({"msg": result.errors[0].msg});
    }
}

const fetchUser= async (req,res)=>{
    //console.log(req);
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
            res.status(401).json({"msg":"Email already exists"});
        }
    }
    else{
        res.status(404).json({"msg": result.errors[0].msg});
    }
}

const handleLogout=async(req,res)=>{
    const cookies=req.cookies;
    if(!cookies?.jwt){
        res.status(200).json({"msg":"logout successful"});
    }
    else{
        const token=cookies.jwt;
        res.clearCookie('jwt', { path: '/' });
        const user=await User.findOne({refreshToken:token}).exec();
        if(!user){
            res.status(200).json({"msg":"logout successful"});
        }
        else{
            user.refreshToken="";
            const result=await user.save();
            res.status(200).json({"msg":"logout successful"});
        }
    }
}
module.exports={handleLogin,fetchUser,createUser,handleLogout};