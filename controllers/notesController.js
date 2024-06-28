const express=require('express');
const path=require('path');
const Note=require(path.join(__dirname,'..','model','Note.js'));
const {validationResult}=require('express-validator');
const { default: mongoose } = require('mongoose');

const fetch=async(req,res)=>{
    const notes=await Note.find({user:req.user.id});
    res.status(201).json(notes);
}

const newNote=async (req,res)=>{
    const result=validationResult(req);
    if(result.isEmpty()){
        try{
            const {title,description,tag}=req.body;
            const new_note=new Note({user:req.user.id,title,description,tag});
            await new_note.save();
            res.status(201).json({new_note});
        }catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    }else{
        res.status(406).json(result);
    }
}

const updateNote=async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({'message':'invalid id'});  
        }
    try{
        const note=await Note.findOne({_id:req.params.id}).exec();
        if(note){
            if(note.user.toString()!==req.user.id){
                res.status(404).json({"msg":"No note found"});
            }
            else{
                const {title,description,tag}=req.body;
                if(title)note.title=title;
                if(description)note.description=description;
                if(tag)note.tag=tag;
                await note.save();
                res.status(200).json({"msg":"note found and updated successfully"});
            }
        }
        else{
            res.status(404).json({"msg":"No note found"})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error});
    }
}

const deleteNote=async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({'message':'invalid id'});  
        }
    try{
        const note=await Note.findOne({_id:req.params.id}).exec();
        if(note){
            if(note.user.toString()!==req.user.id){
                res.status(404).json({"msg":"No note found"});
            }
            else{
                await Note.deleteOne({_id:note.id});
                res.status(200).json({"msg":"note found and deleted successfully",note});
            }
        }
        else{
            res.status(404).json({"msg":"No note found"})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error});
    }
}
module.exports={fetch,newNote,updateNote,deleteNote};