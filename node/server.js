//Packages
var pg = require('pg'),
    path = require('path'),
    db = require('./database.js'),
    express = require('express'),
    bodyParser = require('body-parser')

//Constants
const port = process.env.PORT || 8080;

//Set up database connection
db = new db();
//Check if tables exist, else create them
db.setupDB();

//Set up express and middleware
var app = express();
app.use(express.static('../public'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(function(err, req, res, next) { //Catch JSON parsing errors and complain to client
    res.status(400).send('Malformed request. Please ensure JSON is correct and all values are double quoted.');
});

/* API Routes */
//Creates a match in DB
app.post('/api/create', function(req, res) {
    console.log(req.body);
    db.addMatch(req.body, {});
    //Find match
});

/* Server instantiation */
var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
