const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');

const Employee = require('../models/Employees');
const User = require('../models/Users');


// @route   get /employees
// @desc    get all employees
// @access  Private
router.get('/', auth, async (req, res) => {
    try{
        const employees = await Employee.find();
        res.json(employees);
    }catch(err){
        res.status(500).send('Server error');
    }
})



// @route   get /employees/:type
// @desc    get employees by type
// @access  Public for now, will change to private
router.get('/:type', async (req, res) => {
    try {
        const employees = await Employee.find({type: req.params.type, active: true});
        res.json(employees);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
})

// @route   delete /employees/:empId
// @desc    delete employee by id
// @access  Private
router.delete('/:empId', auth, async (req, res) => {
    try{
        console.log('in here');
        const employee= await Employee.findById(req.params.empId);
        console.log(employee);
        await employee.remove()
        res.json({msg: 'Employee Removed'});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
})

// @route   POST /employees
// @desc    create an employee
// @access  Private
router.post(
    '/', 
    [
        auth,
        [
            check('name', 'Name is required').not().isEmpty(),
            check('type', 'Type is required').not().isEmpty(),
            check('access', 'Access is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        console.log(req.body);

        const {userId, name, type, access} = req.body;

        try {
            let user = null;
            if(userId){
                console.log('in here');
                user = await User.findById(userId);
                console.log(user);
            }

            let emp = new Employee({user, name, type, access});
            await emp.save();
            res.json(emp);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }

    }
)

module.exports = router;