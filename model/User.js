const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userSchema=new Schema({
    user:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    refreshToken:{
        type: String,
    }
});

module.exports=mongoose.model('User',userSchema);