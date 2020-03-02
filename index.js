const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors')

const app = express();

//currently open to anyone, need to restrict it when done with front end
app.use(cors());

connectDB();

//initialize middleware
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('Hello World! x2'));

app.use('/orders', require('./routes/orders'));
app.use('/auth', require('./routes/auth'));
app.use('/employees', require('./routes/employees'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port:  ${PORT}`));