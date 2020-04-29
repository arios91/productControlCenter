const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const {check, validationResult} = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/Users');


// @route   Get /auth
// @desc    Get User
// @access  Public
router.get('/', auth, async(req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        res.status(500).send('Server Error');
    }
});

// @route   POST /auth/register
// @desc    Register user
// @access  Public
router.post('/register', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Invalid email').isEmail(),
        check('password', 'Password must be six or more characters').isLength({min: 6})
    ],
    async (req, res) => {
        //error validation before continuing
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {name, email, password} = req.body;

        try{
            //check if user exists
            let user = await User.findOne({email});
            if(user){
                //return an error matching the format of previous errors
                return res.status(400).json({errors: [{msg: 'User already exists'}]})
            }

            
            user = new User({
                name,
                email,
                password 
            })

            //anything that returns a promise must have 'await'
            //this replaces the .then() notation
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload, 
                keys.jwtSecret,
                {expiresIn: 360000},
                (err, token) => {
                    if(err){
                        throw err;
                    }
                    res.json({token});
                });

        }catch(err){
            return res.status(500).send('Server Error');
        }
    }
)


// @route   Post /auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', 
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        //error validation before continuing
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        console.log(req);

        const {email, password} = req.body;

        try{
            //check if user exists
            let user = await User.findOne({email});
            if(!user){
                //return an error matching the format of previous errors
                return res.status(400).json({errors: [{msg: 'Invalid credentials'}]})
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({errors: [{msg: 'Invalid credentials'}]})
            }



            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                keys.jwtSecret,
                {expiresIn: 360000},
                (err, token) => {
                    if(err){
                        throw err;
                    }
                    res.json({token});
                });

        }catch(err){
            console.log(err);
            return res.status(500).send('Server Error');
        }
    }
)

module.exports = router;