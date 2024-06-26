
const path=require('path');
const User=require(path.join(__dirname,'..','model','User'));
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
module.exports={fetchUser};