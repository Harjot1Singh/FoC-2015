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
        var welcomeMessageTimer;
        var matches = [];
        var number;
        var message;
        var user;
        db.getUserDetails(userID, function(row) {
            message = "Hey, " + row.firstname + ". Thanks for signing up to Envolve.\nWe'll let you know when anyone else feels like " + req.body.activityName + "."
            number = row.number;
        });
        db.addRequest(userID, req.body, function(reqID) {
            requestID = reqID;
            //Send 
            result.status(200).send({
                "requestID": requestID
            });
            db.findMatches(requestID, function(mainUser, otherUser, distanceMiles) {
                matches.push(otherUser);
                user = mainUser;
                //Link user id to other request and vice versa
                db.insertMatch(otherUser.userid, mainUser.id, distanceMiles);
                db.insertMatch(mainUser.userid, otherUser.id, distanceMiles);
                //Text only the other user already in the DB
                var otherMessage = "Hey, " + otherUser.firstname + ". " + mainUser.firstname + " also feels like " + mainUser.activityname + ".\nVisit http://envolve-app.com/ to view more details.";
                sms.send(otherUser.number, otherMessage);
            }, function() {
                //OnComplete - check what message to send to the new user
                if (matches.length === 0) {
                    //Send welcome message
                    console.log("length is 0");
                    sms.send(number, message);
                }
                else if (matches.length <= 5) {
                    //Add all names into one message
                    var mainMessage = "Hey, " + user.firstname + ". "
                    var names = '';
                    matches.forEach(function(index) {
                        names = names + index.firstname + ',';
                    });
                    names = names.substring(0, names.length - 1);
                    mainMessage = mainMessage + names + " also feel like " + user.activityname + ".\nVisit http://envolve-app.com/ to view more details.";
                    if (matches.length === 1) {
                        mainMessage = mainMessage.replace("feel", "feels");
                    }
                    sms.send(user.number, mainMessage);
                }
                else sms.send(user.number, "Hey, " + user.firstname + ". " + matches.length + ' people have been found who also feel like ' + user.activityname + ".\nVisit http://envolve-app.com/ to view more details.");
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

//BROKEN - FIX
//Timer for expiry of matches
// setInterval(function() {
//     db.deleteExpired(function () {
//       //On delete 
//     });
// }, 60000);
//86400000 ms in a day

//TODO Expiry of single user from matches
//TODO acceptance and rejection of requests
//TODO