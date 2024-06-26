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
module.exports={handleLogin};