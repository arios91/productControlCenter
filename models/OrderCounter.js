const mongoose = require('mongoose');

const OrderCounterSchema = new mongoose.Schema({
    counter:{
        type: Number,
        default: true
    }
});

module.exports = Employee = mongoose.model('orderCounter', OrderCounterSchema);