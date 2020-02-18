const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNum:{
        type: String,
        required: true
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
    deliveryAddress:{
        type: String,
        required: true
    },
    deliveryPhone:{
        type: String,
        required: true
    },
    customer:{
        type: String,
        required: true,
    },
    customerPhone:{
        type: String,
        required: true,
    },
    driver:{
        type: String
    }

});

module.exports = Order = mongoose.model('order', OrderSchema);