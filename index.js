const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors')
const PORT = process.env.PORT || 5000;
const router = express.Router();
var request = require("request");
const keys = require('./config/keys');

//Include SendInBlueLibrary
var lib = require('sib-api-v3-sdk');
var defaultClient = lib.ApiClient.instance;
//Instantiate the client
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = keys.blueKey;

const app = express();


//currently open to anyone, need to restrict it when done with front end
// app.use(cors({
//     origin: 'https://petalos-y-arte-cc-client.herokuapp.com'
// }));

app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(keys.whiteList.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));

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
                  'api-key': keys.blueKey
                }
              };
              
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
                console.log(body);
                res.json(body);
            });

        }catch(err){
            res.status(500).send('Server error');
        }
    })
)


app.listen(PORT, () => console.log(`listening on port:  ${PORT}`));