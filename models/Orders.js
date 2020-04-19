const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNum:{
        type: String,
        required: true
    },
    orderCount:{
        type: Number
    },
    description:{
        type: String,
        required: true
    },
    cardMessage:{
        type: String,
    },
    specialInstructions:{
        type: String
    },
    status:{
        type: String,
        default: 'new'
    },
    inDate: {
        type: Date,
        default: Date.now
    },
    statusDate: {
        type: Date,
        default: Date.now
    },
    recipient:{
        type: String,
        required: true
    },
    deliveryAddress:{
        type: String,
        required: true
    },
    deliveryPhone:{
        type: String,
        required: true
    },
    deliveryDate:{
        type: Date,
        required: true
    },
    customer:{
        type: String,
    },
    customerPhone:{
        type: String,
    },
    driver:{
        type: String
    },
    driverId:{
        type: String
    },
    orderTotal:{
        type: Number
    },
    distanceFromShop:{
        type: Number
    },
    distanceFromPrevious:{
        type: Number
    },
    distanceToNext:{
        type: Number
    },
    bloomOrder:{
        type: Boolean,
        default: false
    }
});

module.exports = Order = mongoose.model('order', OrderSchema);