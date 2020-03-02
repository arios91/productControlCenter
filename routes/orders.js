const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const Order = require('../models/Orders');


// @route   get api/orders
// @desc    get all orders
// @access  Public
router.get('/', async (req, res) => {
    try{
        const orders = await Order.find();
        res.json(orders);
    }catch(err){
        res.status(500).send('Server error');
    }
})

// @route   POST api/orders
// @desc    Submit an order
// @access  Public
router.post(
    '/', 
    [
        check('orderNum' , 'Order number is required').not().isEmpty(),
        check('deliveryAddress' , 'Delivery Address is required').not().isEmpty(),
        check('deliveryPhone' , 'Delivery Phone is required').not().isEmpty(),
        check('customer' , 'Customer is required').not().isEmpty(),
        check('customerPhone' , 'Customer Phone is required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {
            orderNum,
            deliveryAddress,
            deliveryPhone,
            customer,
            customerPhone
        } = req.body;

        
        try{
            let order = new Order({
                orderNum,
                deliveryAddress,
                deliveryPhone,
                customer,
                customerPhone
            })

            await order.save();
            const payload = {
                order:{
                    id: order.id
                }
            }

            res.json(payload);

        }catch(err){
            return res.status(500).send('Server error');
        }
    }
)



module.exports = router;