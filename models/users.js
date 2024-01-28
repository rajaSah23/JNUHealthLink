//GOAL: to create a mongoDB collection model for 'users'
const mongoose = require('mongoose');
// const { type } = require('os');

//Note: Here we don't need to establish connection with DB again
//bcoz, we will require("index.js") , where we already established connection with DB

//Lets, Define Schema

const userSchema= new mongoose.Schema({
    name:{
            type:String,
            required:true
    }, 
    phone:{
        type:String,
        required:true,
        maxLength:10
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
});

//Creting Model: 'User' , means, in DB collection:'Users'
const User= mongoose.model("User",userSchema); 

module.exports=User;