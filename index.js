const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');//PATCH, DELETE req ke liye,note: npm i method-override
require('dotenv').config();

//setting path for views file
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

//setting path for html and css files
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true})); //url se data nikalne k liye

//models import
const User= require("./models/users.js");
const { log } = require('console');

//MongoDB connection
async function main() {
    const dburl=process.env.DB_URL;
    await mongoose.connect(`${dburl}/jnuhealthlink`);//to create and connect with new 

  }
  //calling main() method to execute
  main().then((res)=>{
      console.log("MongoDB Connection successful");
      console.log(res);
  }).catch(err => console.log(err));


app.get('/', (req, res) => {
//   res.send('Hello World!');
    res.render('index.ejs',{name:"Raja Sah"});
});



//All Route
app.use('/', require('./routes/mainRouter.js'));  //goto routes/mainRouter.js 


app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`);
});