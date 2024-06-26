const express=require('express');
const router=express.Router();
const path=require('path');
const {body}=require('express-validator');
const authController=require(path.join(__dirname,'..','controllers','authController'));
router.post('/',
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:1}).withMessage('Password cannot be empty'),
    authController.handleLogin
);

module.exports=router;