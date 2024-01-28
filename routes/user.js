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
const { log } = require('console');
const dataHandler = require('../dataHandler.js');

let userid=0;
router.get('/home/:id', async(req, res) => {
    userid = req.params.id;
    //for testing purposes
    // let newAppointment = new Appointment({
    //     userid:"65a1363f7b733a03d011409e" ,
    //     docid:"65a1b81ff66f30c5790c11b6",
    //     date: new Date,
    //     status:"Booked",
    // });
    // console.log(newAppointment);
    // await newAppointment.save();
    // res.render('userDashboard.ejs');
    
    //Work in progress
    // dataHandler.setSharedData("hello raja")
    // console.log(dataHandler.getSharedData());
    // dataHandler.setSharedData("")   
    
    let {msgType,message}= dataHandler.getSharedData();
    dataHandler.setSharedData("");     // Clear the error message in the shared module
    // console.log(loginMsg);


    let appointments=await Appointment.find({userid:userid});
    let data=[];
    for(let appointment of appointments){
        let obj=await Doctor.findById(appointment.docid,{_id:0,name:1,phone:1,email:1,specialty:1});
        let d=await appointment.date;
        console.log(appointment.docid);
        // console.log();
        obj.date= d;
        obj.time= appointment.time;
        obj.status=appointment.status;
        obj.apid=appointment._id.toString();
        data.push(obj);
    } 
    // console.log(appointments);
    console.log(data,userid);
    // console.log(newAppointment);
    // await newAppointment.save();


    //Finding user details
    let user=await User.findById(userid);
    // console.log(user);
    res.render('userDashboard.ejs',{data,userid,user,msgType,message});
}); 
 
router.use(methodOverride('_method'));//.patch() me translate krne k liye
//Book Appointment by user
router.get('/appointment/:id', async(req, res) => {
    let {msgType,message}= dataHandler.getSharedData();
    dataHandler.setSharedData("");     // Clear the error message in the shared module

    specialty=await Doctor.find({},{_id:0,specialty:1})
    console.log(specialty);
    let user=await User.findById(userid);
    res.render('newAppointment.ejs',{user,userid,specialties:specialty,doctors:null,selected:"", msgType,message});
})
//Cancel Appointment by user
router.delete('/appointment/:id', async(req, res) => {
    let deleted=await Appointment.findByIdAndDelete(req.params.id);
    console.log("One Appointment deleted");
    console.log(deleted); 
    dataHandler.setSharedData("success","One Appointment deleted");
    res.redirect('/user/home/'+userid);
})

router.post('/appointment/book', async(req, res) => {
    console.log("Booking deatils:",req.body);
    if(req.body.date==='' || req.body.time===''){
        res.send("enter date and time");
        return;
    } 
    
    //Check if appointment already exists
    let today=new Date()
    let inputDate=new Date(req.body.date)
    if(inputDate<today){
        dataHandler.setSharedData("error","Please enter valid date");
        // res.send({error:"Please enter valid date"});
        res.redirect('/user/appointment/'+userid);

        return;
    }

    let hr=req.body.time.substring(0,2);
    let currTime=new Date();
    parseInt(hr);
    // if(hr<9 || hr>17 || hr<currTime.getHours()){     //pta nhi kyo ni chl rha ye
    if(hr<9 || hr>17){
        dataHandler.setSharedData("error","Please select time between 9:00 AM to 5:00 PM");
        res.redirect('/user/appointment/'+userid);

        // res.send({error:"Please select time between 9:00 AM to 5:00 PM"});
        return;
    }

    let oldAppoint=await Appointment.findOne({docid:req.body.docid, date:req.body.date,time:req.body.time , status:"Booked"});
    if(oldAppoint){
        dataHandler.setSharedData("error","Appointment already exists");
        res.redirect('/user/appointment/'+userid);

        // res.send({error:"Appointment already exists"});
        return;
    }

    let appointment=new Appointment(req.body);
    // console.log(appointment);
    await appointment.save();
    dataHandler.setSharedData("success","Appointment booked");
     res.redirect('/user/home/'+userid);

}); 

router.post('/appointment/:id', async(req, res) => {
    console.log(req.body);
    let {specialty}=req.body;
    let doctors=[];

    specialties=await Doctor.find({},{_id:0,specialty:1})

    doctors=await Doctor.find({specialty},{username:0,password:0})
    // console.log(doctors);
    let user=await User.findById(userid);

    let {msgType,message}= dataHandler.getSharedData();
    dataHandler.setSharedData("");     // Clear the error message in the shared module
    res.render('newAppointment.ejs',{user,userid,specialties,doctors,selected:{specialty},msgType,message});
})

// Profile and update section 
router.get('/profile/:id', async(req, res) => {
    userid = req.params.id;
    let {msgType,message}= dataHandler.getSharedData();
    let user=await User.findById(userid);
    res.render('userProfile.ejs',{user,msgType,message});
})

router.post('/profile', async(req, res) => {
    //Validation
    let newUser=req.body;
            if(newUser.phone.length!=10) {
                // res.status(400).json({ error: 'Phone number must be 10 digits' });
                dataHandler.setSharedData("warning","Phone number must be 10 digits");
                res.redirect('/user/profile/'+userid);
                return;
            }
            if(newUser.password.length<6) {
                // res.status(400).json({ error: 'Password must be at least 6 digits' });
                dataHandler.setSharedData("warning","Password must be at least 6 digits");
                res.redirect('/user/profile/'+userid);
                return;
            }
            //email verification
            let user= await User.findOne({ email: newUser.email}); 
            
            if(user && user._id!=newUser._id) {
                // res.status(400).json({ error: 'Email already exists' });
                dataHandler.setSharedData("error","Email already exists");
                res.redirect('/user/profile/'+userid);
                return;
            }
            //username verification:useless
            user= await User.findOne({ username: newUser.username}); 
            if(user && user._id!=newUser._id) {
                res.status(400).json({ error: 'Username already exists' });
                return;
            }
    console.log("validation successful");
    let updatedUser=await User.findByIdAndUpdate(req.body._id,req.body,{new:true});
    // res.send(updatedUser);
    dataHandler.setSharedData("success","Profile updated");
    res.redirect('/user/home/'+updatedUser._id);
})

module.exports=router;