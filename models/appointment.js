//GOAL: to create a mongoDB collection model for 'appointments'
const mongoose = require('mongoose');

//Note: Here we don't need to establish connection with DB again
//bcoz, we will require("index.js") , where we already established connection with DB

//Lets, Define Schema
const appointmentSchema= new mongoose.Schema({
    userid:{
            type:String,
            required:true
    }, 
    docid:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true
    },
});

//Creting Model: 'Appointment' , means, in DB collection:'appointments'
const Appointment= mongoose.model("Appointment",appointmentSchema); 

module.exports=Appointment;