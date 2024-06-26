const {validationResult}=require('express-validator');
const path=require('path');
const User=require(path.join(__dirname,'..','model','User'));
const bcrypt = require('bcrypt');
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
module.exports={createUser};