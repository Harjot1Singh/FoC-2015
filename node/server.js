var pg = require('pg'),
    path = require('path'),
    db = require('./database.js')(),
    express = require('express');

//Constants
const port = process.env.PORT || 8080;

//Set up express to set the root at /public
var app = express();
app.use(express.static('../public'));

/* API Routes */ 
app.get('/api', function(req, res) {
    res.send('hello');
});

/* Server instantiation */
var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});