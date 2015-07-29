var pg = require("pg");

//Wrapper for all database functionality
var DB = function() {
    //Environment specific constructor
    if (process.env.development == "true") {
        //Database in C9 environment - remember to set development = true in environment
        this.connString = "postgres://postgres:postgres@localhost/biscuit";
    }
    else {
        //TBC username + password + ip
        this.connString = "postgres://postgres:postgres@randomhost/biscuit";
    }

};


//Checks if tables exist, if not, creates them
DB.prototype.setupDB = function() {
    var client = new pg.Client(this.connString);
    client.connect(function(err) {
        if (err) {
            return console.error('Could not connect to postgres', err);
        }
        //Create tblUsers
        client.query("CREATE TABLE IF NOT EXISTS tblUsers  ( \
                    id SERIAL, \
                    gender INT, \
                    firstName VARCHAR(50), \
                    lastName VARCHAR(50), \
                    dob DATE, \
                    number VARCHAR(20), \
                    email VARCHAR(100), \
                    serviceID VARCHAR(50), \
                    serviceName VARCHAR(20) \
                    );", function(err, result) {
            if (err) {
                return console.error('Error:', err);
            }
            console.info('tblUsers processed');
        });
        //Create tblQueue
        client.query("CREATE TABLE IF NOT EXISTS tblQueue ( \
                    id SERIAL, \
                    userID INT, \
                    gender VARCHAR(10), \
                    locationX FLOAT, \
                    locationY FLOAT, \
                    endDate DATE \
                    );", function(err, result) {
            if (err) {
                return console.error('Error:', err);
            }
            console.info('tblQueue processed');
        });
        console.info('DB initialised successfully');
    });
};

module.exports = DB;