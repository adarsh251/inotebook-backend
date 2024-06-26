const {validationResult}=require('express-validator');
const path=require('path');
const User=require(path.join(__dirname,'..','model','User'));
const createUser= async (req,res)=>{
    const result=validationResult(req);
    // const arr=JSON.stringify(result);
    // console.log(arr);
    if(result.isEmpty()){
        const user=await User.findOne({email:req.body.email});
        if(!user){
            await User.create({
                "user":req.body.user,
                "email":req.body.email,
                "password":req.body.password
            })
            res.status(201).send(`ok ${result}`);
        }
        else{
            res.status(404).send("Email already exists");
        }
    }
    else{
        console.log(result.errors); 
        res.status(404).send(result.errors[0].msg);
    }
}
module.exports={createUser};