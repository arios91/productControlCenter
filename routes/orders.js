const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const distance = require('google-distance-matrix');
    distance.key('AIzaSyCXjfp9HEYuq1W9m2H_RI7nFzpShH-epMQ')
    distance.mode('driving');
    distance.units('imperial');
const Order = require('../models/Orders');
const OrderCounter = require('../models/OrderCounter')


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

router.get('/count', async (req,res) => {
    try {
        let orderCount = await OrderCounter.findOne();
        console.log(orderCount.counter);
        res.json(orderCount);
    } catch (error) {
        console.log(error);
    }
})





const getDistance = (destination) => {
    const p1 = new Promise(function(resolve, reject){
        var origins = ['200 N La Homa Rd, Mission TX'];
        var destinations = [destination];
     
        distance.matrix(origins, destinations,  function (err, distances) {
            if (distances.status == 'OK') {
                for (var i=0; i < origins.length; i++) {
                    for (var j = 0; j < destinations.length; j++) {
                        var origin = distances.origin_addresses[i];
                        var destination = distances.destination_addresses[j];
                        if (distances.rows[0].elements[j].status == 'OK') {
                            var distance = distances.rows[i].elements[j].distance.text;
                            console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);

                            resolve(distance.split(' ')[0]);
                        } else {
                            console.log(destination + ' is not reachable by land from ' + origin);
                            resolve(-1);
                        }
                    }
                }
            }
        });
    });
    return p1;
}


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
            console.log(errors);
            return res.status(400).json({errors: errors.array()});
        }
        console.log(req.body);

        const {
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
        } = req.body;
        
        try{
            if(req.body._id && req.body.status){
                let existingOrder = await Order.findById(req.body._id);
                if(existingOrder){
                    const upd = {};
                    upd.status = req.body.status;
                    upd.statusDate = new Date();
                    if(req.body.driver){
                        upd.driver = req.body.driver;
                    }
                    existingOrder = await Order.findOneAndUpdate(
                        {_id: req.body._id},
                        {$set: upd},
                        {new: true}
                    );

                    return res.json(existingOrder);
                }
            }
            
            let orderCounter = await OrderCounter.findOne();
            let distanceFromShop = await getDistance(deliveryAddress);
            if(distanceFromShop){
                console.log(distanceFromShop);
            }
            console.log('out of distanceMatrix');

            let order = new Order({
                orderNum,
                orderCount : orderCounter.counter,
                description,
                cardMessage,
                specialInstructions,
                recipient,
                deliveryAddress,
                deliveryPhone,
                deliveryDate,
                customer,
                customerPhone,
                orderTotal,
                distanceFromShop
            })

            await order.save();

            orderCounter.counter += 1;
            await OrderCounter.findOneAndUpdate(
                {_id : orderCounter._id},
                {$set : orderCounter},
                {new: true}
            )
            

            res.json(order);

        }catch(err){
            console.log(err);
            return res.status(500).send('Server error');
        }
    }
)



module.exports = router;