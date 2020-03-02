const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    access: {
        type: Number,
        required: true
    },
    active:{
        type: Boolean,
        default: true
    }
});

module.exports = Employee = mongoose.model('employee', EmployeeSchema);