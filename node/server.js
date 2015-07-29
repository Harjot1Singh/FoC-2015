//Packages
var db = require('./database.js'),
    express = require('express'),
    sms = require('./sms.js'),
    bodyParser = require('body-parser');

//Constants
const port = process.env.PORT || 8080;

//Set up database connection
db = new db();
//Check if tables exist, else create them
db.setupDB();

//Set up express and middleware
var app = express();
app.use(function(req, res, next) {
    // console.info('[URL]:', req.url);
    next();
});
app.use('', express.static('../public'));
app.use('/testing', express.static('../testing'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(function(err, req, res, next) { //Catch JSON parsing errors and complain to client
    res.status(400).send('Malformed request. Please ensure JSON is correct and all values are double quoted.');
});

/* API Routes */
/* Create/auth user
@parameter user (firstName, lastName, gender, dob, number, email, pictureURL, serviceID, serviceName)
*/
app.post('/api/user/create', function(req, res) {
    var result = res;
    //Go find a match
    if (req.body) {
        db.addUser(req.body, function(userID) {
        //Send 
            result.status(200).send({"userID" : userID});
        });
    }
    else {
        result.status(400).send('Please ensure you are sending user and matchDetails objects.');
    }
});

/* Create a match request
@parameter matchDetails (gender, locationX, locationY, endDate, publicName)
*/
app.post('/api/request/create', function(req, res) {
    var result = res;
    //Go find a match
    if (req.body) {
        db.addMatch(req.userID, req.body, function(requestID) {
        //Send 
            result.status(200).send({"requestID" : requestID});
        });
    }
    else {
        result.status(400).send('Please ensure you are sending user and matchDetails objects.');
    }
});



/* Server instantiation */
var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});
