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
        check('description' , 'Description is required').not().isEmpty(),
        check('recipient' , 'Recipient is required').not().isEmpty(),
        check('deliveryAddress' , 'Delivery Address is required').not().isEmpty(),
        check('deliveryPhone' , 'Delivery Phone is required').not().isEmpty(),
        check('deliveryDate' , 'Delivery Date is required').not().isEmpty(),
        check('orderTotal' , 'Order total is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {
            orderNum,
            description,
            cardMessage,
            specialInstructions,
            recipient,
            deliveryAddress,
            deliveryPhone,
            dliveryDate,
            customer,
            customerPhone,
            orderTotal
        } = req.body;

        
        try{
            let order = new Order({
                orderNum,
                description,
                cardMessage,
                specialInstructions,
                recipient,
                deliveryAddress,
                deliveryPhone,
                deliveryDate,
                customer,
                customerPhone,
                orderTotal
            })

            await order.save();

            res.json(order);

        }catch(err){
            console.log(err);
            return res.status(500).send('Server error');
        }
    }
)



module.exports = router;