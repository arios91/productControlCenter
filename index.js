const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors')
const PORT = process.env.PORT || 5000;
const router = express.Router();
var request = require("request");

//Include SendInBlueLibrary
var lib = require('sib-api-v3-sdk');
var defaultClient = lib.ApiClient.instance;
//Instantiate the client
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

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
app.use('/test', require('./routes/test'));


app.use('/test2',

    router.get('/', async (req, res) => {
        try{

            var options = {
                method: 'GET',
                url: 'https://api.sendinblue.com/v3/account',
                headers: {
                  accept: 'application/json',
                  'api-key': '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'
                }
              };
              
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
                console.log(body);
                res.json(body);
            });

            // const testObject = {name: "john", lastName:"doe2"};
            // res.json(testObject);
        }catch(err){
            res.status(500).send('Server error');
        }
    })
)


app.listen(PORT, () => console.log(`listening on port:  ${PORT}`));