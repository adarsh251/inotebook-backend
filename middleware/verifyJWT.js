const jwt=require('jsonwebtoken');
const verifyJWT=(req,res,next)=>{
    const authHeader=req.headers.authorization || req.headers.Authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer '))res.status(401).json({"msg":"Authorize user"});
    else{
        const token=authHeader.split(' ')[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,
            (err,decoded)=>{
                if(err)return res.status(401).json({"msg":"Invalid credentials"});
                else{
                    req.user=decoded.user;
                    next();
                }
            }
        );
    }
}
module.exports=verifyJWT;