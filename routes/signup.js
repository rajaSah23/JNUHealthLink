const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const methodOverride = require('method-override');//PATCH, DELETE req ke liye,note: npm i method-override

//models import
const User= require("../models/users.js");
const dataHandler = require('../dataHandler.js');


router.get('/user', (req, res) => {
    let {msgType,message}= dataHandler.getSharedData();
    dataHandler.setSharedData("");     // Clear the error message in the shared module
    res.render('signup.ejs',{msgType,message});
  });


  router.post('/user', async (req, res) => {
        try {
            console.log("new signup");
            // console.log(req.body);
    
            let newUser = new User(req.body);
            if(newUser.phone.length!=10) {
                // res.status(400).json({ error: 'Phone number must be 10 digits' });
                dataHandler.setSharedData("warning","Phone number must be 10 digits");
                res.redirect('/signup/user');
                return;
            }
            if(newUser.password.length<6) {
                // res.status(400).json({ error: 'Password must be at least 6 digits' });
                dataHandler.setSharedData("warning","Password must be at least 6 digits");
                res.redirect('/signup/user');
                return;
            }
            //email verification
            let user= await User.findOne({ email: newUser.email}); 
            if(user) {
                // res.status(400).json({ error: 'Email already exists' });
                dataHandler.setSharedData("error","Email already exists");
                res.redirect('/signup/user');
                return;
            }
            //username verification
            user= await User.findOne({ username: newUser.username}); 
            if(user) {
                // res.status(400).json({ error: 'Username already exists' });
                dataHandler.setSharedData("error","Username already exists");
                res.redirect('/signup/user');
                return;
            }
            //username verification
            await newUser.validate(); // Validate the user model
    
            newUser.save();
            // console.log(newUser);
            // console.log(newUser.name);
            // console.log(parseInt(newUser.phone) + 1);
            dataHandler.setSharedData("success","Account Created Succesfully");
            res.redirect("/login/user");//redirecting to desired page
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                // Handle validation errors
                const validationErrors = Object.values(error.errors).map((err) => err.message);
                res.status(400).json({ error: 'Validation failed', details: validationErrors });
            } else {
                // Handle other errors
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        }
    });






// Doctor's SignUp
//models import
const Doctor= require("../models/doctors.js");
router.get('/doctor', (req, res) => {
    res.render('doctorSignup.ejs');
  });


router.post('/doctor', async (req, res) => {
    try {
        console.log("new doc signup");
        // console.log(req.body);

        let newDoc = new Doctor(req.body);
        if(newDoc.phone.length!=10) {
            res.status(400).json({ error: 'Phone number must be 10 digits' });
            return;
        }
        if(newDoc.password.length<6) {
            res.status(400).json({ error: 'Password must be at least 6 digits' });
            return;
        }
        //email verification
        let doctor= await Doctor.findOne({ email: newDoc.email}); 
        if(doctor) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }
        //username verification
        doctor= await Doctor.findOne({ username: newDoc.username}); 
        if(doctor) {
            res.status(400).json({ error: 'Username already exists' });
            return;
        }
        //username verification
        await newDoc.validate(); // Validate the doc model

        newDoc.save();
        // console.log(newDoc);
        // console.log(newDoc.name);
        // console.log(parseInt(newDoc.phone) + 1);
        res.redirect("/login/doctor");//redirecting to desired page
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Handle validation errors
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({ error: 'Validation failed', details: validationErrors });
        } else {
            // Handle other errors
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
});


module.exports=router;