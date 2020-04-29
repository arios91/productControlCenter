const mongoose = require('mongoose');
const config = require('config');
const keys = require('./keys');


const connectDB = async () => {
    try{
        await mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    }catch(err){
        console.log(`Error: ${err.message}`);
        console.log(err);
        //exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB; 