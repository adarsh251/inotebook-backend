const User=require('../model/User');

const jwt=require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken= async (req,res) =>{
    const cookies=req.cookies;
    //console.log("---");
    //console.log(cookies);
    if(!cookies?.jwt){
        return res.sendStatus(401);
        }
    const refreshToken=cookies.jwt;
    console.log(refreshToken);
    const foundUser=await User.findOne({refreshToken}).select("-password").exec();
    if(!foundUser) return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err)return res.sendStatus(403);
            if(foundUser._id.toString()!==decoded.id)return res.sendStatus(404);
            const accessToken=jwt.sign(
                {
                    "user":{
                        "email":foundUser.email,
                        "id":foundUser._id,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'10m'}
            );
            //delete foundUser['password'];
            console.log(foundUser);
            res.send({foundUser,accessToken});
        }
    );
}
module.exports={handleRefreshToken};