const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');


const connectDB = async () => {
    try{
        await mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        console.log('MongoDB Connected...');
    }catch(err){
        console.log("ALEX ERROR!!!");
        console.log(`Error: ${err.message}`);
        console.log("ALEX ERROR!!!");
        console.log(err);
        //exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB; 