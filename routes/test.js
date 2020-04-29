const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');

const Employee = require('../models/Employees');
const User = require('../models/Users');


// @route   get /test
// @desc    test get
// @access  public
router.get('/', async (req, res) => {
    try{
        const testObject = {name: "john", lastName:"doe"};
        res.json(testObject);
    }catch(err){
        res.status(500).send('Server error');
    }
})


module.exports = router;