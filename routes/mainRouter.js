const express = require('express');
const router = express.Router();


router.use('/signup', require('./signup.js'));
router.use('/login', require('./login.js'));

router.use('/user', require('./user.js'));
router.use('/doctor', require('./doctor.js'));


module.exports=router;