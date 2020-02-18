const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

//initialize middleware
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('Hello World! x2'));

app.use('/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port:  ${PORT}`));