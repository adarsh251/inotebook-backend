const express=require('express');
const router=express.Router();
const path=require('path');
const {body}=require('express-validator');
const userController=require(path.join(__dirname,'..','..','controllers','userController'));
const refreshTokenController=require(path.join(__dirname,'..','..','controllers','refreshTokenController'));
const verifyJWT=require(path.join(__dirname,"..","..","middleware","verifyJWT"));

router.post('/register',
    body('user').notEmpty().withMessage('Empty username'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:5}).withMessage('Password is too small'),
    userController.createUser
);
router.get('/refresh',
    refreshTokenController.handleRefreshToken
);
router.post('/login',
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:1}).withMessage('Password cannot be empty'),
    userController.handleLogin
);
router.get('/credentials',
    verifyJWT,
    userController.fetchUser
);
router.post('/logout',
    userController.handleLogout
);
module.exports=router;