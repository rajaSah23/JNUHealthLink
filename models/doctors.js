//GOAL: to create a mongoDB collection model for 'doctors'
const mongoose = require('mongoose');

//Note: Here we don't need to establish connection with DB again
//bcoz, we will require("index.js") , where we already established connection with DB

//Lets, Define Schema

const doctorSchema= new mongoose.Schema({
    name:{
            type:String,
            required:true
    }, 
    phone:{
        type:String,
        required:true,
        maxLength:10
    },
    email:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    specialty:{
        type:String,
        required:true
    },
    bio:{
        type:String,
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

//Creting Model: 'Doctor' , means, in DB collection:'Users'
const Doctor= mongoose.model("Doctor",doctorSchema); 

module.exports=Doctor;