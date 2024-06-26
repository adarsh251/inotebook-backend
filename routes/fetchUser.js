const express=require('express');
const router=express.Router();
const path=require('path');
const fetchController=require(path.join(__dirname,'..','controllers','fetchController'));
router.get('/',
    fetchController.fetchUser
);

module.exports=router;