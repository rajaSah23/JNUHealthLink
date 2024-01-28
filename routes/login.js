const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const methodOverride = require('method-override');//PATCH, DELETE req ke liye,note: npm i method-override
const path = require('path');



//models import
const User= require("../models/users.js");
const dataHandler = require('../dataHandler.js');


router.get('/user', (req, res) => {
    let {msgType,message}= dataHandler.getSharedData();
    dataHandler.setSharedData("");     // Clear the error message in the shared module
    res.render('login.ejs',{msgType,message});
});
router.post('/user', async(req, res) => {
    console.log("new login");
    console.log(req.body);
    //varifications
    let user=await User.findOne(req.body);
    if(user && user.username===req.body.username && user.password===req.body.password){
        dataHandler.setSharedData("success","login Successful");
        // res.render('userDashboard.ejs');
        res.redirect(`/user/home/${user._id.toString()}`);

    }else{
        dataHandler.setSharedData("error","Invalid username or password");
        res.redirect('/login/user');
    }
});
//doctor's login
const Doctor= require("../models/doctors.js");
router.get('/doctor', (req, res) => {
    let {msgType,message}= dataHandler.getSharedData();
    dataHandler.setSharedData("");     // Clear the error message in the shared module

    res.render('doctorLogin.ejs',{msgType,message});
});

router.post('/doctor', async(req, res) => {
    console.log("doctor login");
    console.log(req.body);
    //varifications
    let doctor=await Doctor.findOne(req.body);
    if(doctor && doctor.username===req.body.username && doctor.password===req.body.password){
        console.log(doctor);
        // res.send('Loging done');
        dataHandler.setSharedData("success","login Successful");
        res.redirect(`/doctor/home/${doctor._id.toString()}`);
    }else{
        // res.send('Invalid username or password');
        dataHandler.setSharedData("error","Invalid username or password");
        res.redirect('/login/doctor');
    }
});
module.exports=router;