const express = require("express");
const router=express.Router();
const path=require('path');
const registerController=require(path.join(__dirname,'..','controllers','registerController'));
const { body } = require("express-validator");

router.post('/',
    body('user').notEmpty().withMessage('Empty username'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:5}).withMessage('Password is too small'),
    registerController.createUser
);
module.exports=router;