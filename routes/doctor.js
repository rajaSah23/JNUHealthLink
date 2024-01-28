const express = require('express');

const app= express();
const router = express.Router();
const mongoose = require('mongoose');
const methodOverride = require('method-override');//PATCH, DELETE req ke liye,note: npm i method-override
const path = require('path');

//models import
const User= require("../models/users.js");
const Appointment= require("../models/appointment.js");
const Doctor= require("../models/doctors.js");

const dataHandler = require('../dataHandler.js');


let docid=0;
router.get('/home/:id', async(req, res) => {
    docid = req.params.id;
    console.log({docid});

    //For notification
    let {msgType,message}= dataHandler.getSharedData();
    dataHandler.setSharedData("");     // Clear the error message in the shared module


    let appointments=await Appointment.find({docid:docid});
    console.log(appointments);
    let data=[];
    for(let appointment of appointments){
        let obj=await User.findById(appointment.userid,{_id:0,name:1,phone:1,email:1,address:1});
        let d=await appointment.date;
        // console.log(appointment.docid);
        // console.log();
        obj.date= d;
        obj.time= appointment.time;
        obj.status=appointment.status;
        obj.apid=appointment._id.toString();
        data.push(obj);
    }
    // console.log(data);

    // Finding Doc details:for navbar
    let doctor=await Doctor.findById(docid);
    // console.log(doctor);
    res.render('doctorDashboard.ejs',{data,docid,doctor,msgType,message});
})



// New Appointments
router.get('/appointment/:id', async(req, res) => {
    docid = req.params.id;
    console.log({docid});
    let appointments=await Appointment.find({docid:docid});
    console.log(appointments);
    let data=[];
    for(let appointment of appointments){
        let obj=await User.findById(appointment.userid,{_id:0,name:1,phone:1,email:1,address:1});
        let d=await appointment.date;
        // console.log(appointment.docid);
        // console.log();
        obj.date= d;
        obj.time= appointment.time;
        obj.status=appointment.status;
        obj.apid=appointment._id.toString();
        data.push(obj);
    }
    console.log(data);

    //For notification
    let {msgType,message}= dataHandler.getSharedData();
    dataHandler.setSharedData("");     // Clear the error message in the shared module



    // Finding Doc details:for navbar
    let doctor=await Doctor.findById(docid);
    // console.log(doctor);
    res.render('docAppointments.ejs',{data,docid,doctor,msgType,message});
})

router.post('/appointment', async(req, res) => {
    let ans= await Appointment.findByIdAndUpdate(req.body.apid,{status:req.body.status},{new:true});
    console.log("Updated:",ans);
    dataHandler.setSharedData("success",`One Appointment ${req.body.status}`);
    res.redirect('/doctor/appointment/'+docid);
})



// Profile and update section 

router.get('/profile/:id', async(req, res) => {
    docid = req.params.id;
    let doctor=await Doctor.findById(docid);
    // res.send(doc);
     //For notification
     let {msgType,message}= dataHandler.getSharedData();
     dataHandler.setSharedData("");     // Clear the error message in the shared module 

    res.render('docProfile.ejs',{doctor,msgType,message});
})

router.post('/profile', async(req, res) => {
    //Validation
    let update=req.body;
            if(update.phone.length!=10) {
                // res.status(400).json({ error: 'Phone number must be 10 digits' });
                dataHandler.setSharedData("warning","Phone number must be 10 digits");
                res.redirect('/doctor/profile/'+update._id);
                return;
            }
            if(update.password.length<6) {
                // res.status(400).json({ error: 'Password must be at least 6 digits' });
                dataHandler.setSharedData("warning","Password must be at least 6 digits");
                res.redirect('/doctor/profile/'+update._id);
                return;
            }
            //email verification
            let doc= await Doctor.findOne({ email: update.email}); 
            
            if(doc && doc._id!=update._id) {
                // res.status(400).json({ error: 'Email already exists' });
                dataHandler.setSharedData("error","Email already exists");
                res.redirect('/doctor/profile/'+update._id);
                return;
            }
            //username verification:useless
            doc= await Doctor.findOne({ username: update.username}); 
            if(doc && doc._id!=update._id) {
                // res.status(400).json({ error: 'Username already exists' });
                dataHandler.setSharedData("error","Username already exists");
                res.redirect('/doctor/profile/'+update._id);
                return;
            }
    console.log("validation successful");
    let updatedDoc=await Doctor.findByIdAndUpdate(req.body._id,req.body,{new:true});
    // res.send(updatedDoc);
    console.log("Doctor Profile Updated");
    dataHandler.setSharedData("success","Profile updated successfully");
     res.redirect('/doctor/home/'+updatedDoc._id);
})



module.exports=router;