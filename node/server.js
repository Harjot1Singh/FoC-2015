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
    console.error('Malformed request:', req.body);
});

/* API Routes */
/* Create/auth user
@parameter user (firstName, lastName, dob, number, email, serviceID, serviceName)
*/
app.post('/api/user', function(req, res) {
    var result = res;
    //Go find a match
    if (req.body) {
        db.addUser(req.body, function(userID) {
            //Send 
            result.status(200).send({
                "userID": userID
            });
        });
    }
    else {
        result.status(400).send('Please ensure you are sending correct JSON.');
    }
});

/* Create a match request
@parameter matchDetails (locationX, locationY, endDate, publicName)
*/
app.post('/api/request', function(req, res) {
    var result = res;
    var userID = req.body.userID;
    var requestID;
    //Go find a match
    if (req.body) {
        db.getUserDetails(userID, function(row) {
            var message = "Hey, " + row.firstname + ". Thanks for signing up to Envolve. \n We'll let you know when anyone else feels like " + req.body.activityName + "."
            sms.send(row.number, message);
        });
        db.addRequest(userID, req.body, function(reqID) {
            requestID = reqID;
            //Send 
            result.status(200).send({
                "requestID": requestID
            });
            db.findMatches(requestID, function(mainUser, otherUser, distanceMiles) {
                //Link user id to other request and vice versa
                db.insertMatch(otherUser.userid, mainUser.id, distanceMiles);
                db.insertMatch(mainUser.userid, otherUser.id, distanceMiles);
                var mainMessage = "Hey, " + mainUser.firstname + ". " + otherUser.firstName + " also feels like " + mainUser.activityName + ". \n Visit http://envolve-app.com/viewmatches to view more details."
                sms.send(mainUser.number, mainMessage);
            });
        });
    }
    else {
        result.status(400).send('Please ensure you are sending correct JSON.');
    }
});




/* Server instantiation */
var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});

db.getMatches(2, function(row) {
    console.log(row);
});

//Timer for expiry of matches
setInterval(function() {
    db.deleteExpired(function () {
       //On delete 
    });
}, 60000);
//86400000 ms in a day

//TODO Expiry of single user from matches
//TODO acceptance and rejection of requests
//TODO