const express=require('express');
const router=express.Router();
const path=require('path');
const {body}=require('express-validator');
const notesController=require(path.join(__dirname,'..','..','controllers','notesController'));
router.get('/all',
    notesController.fetch
)
router.post('/new',
    body('title').notEmpty().withMessage("Title cannot be empty"),
    body('description').notEmpty().withMessage('Description cannot be empty'),
    notesController.newNote
)
router.put("/update/:id",
    notesController.updateNote
)

router.delete("/delete/:id",
    notesController.deleteNote
)
module.exports=router;