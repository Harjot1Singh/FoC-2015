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
                    gender VARCHAR(10), \
                    firstName VARCHAR(50), \
                    lastName VARCHAR(50), \
                    DOB DATE, \
                    number VARCHAR(20), \
                    email VARCHAR(100), \
                    pictureURL VARCHAR(200), \
                    serviceID VARCHAR(50) NOT NULL, \
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
                    genderpreference VARCHAR(10), \
                    publicX FLOAT, \
                    publicY FLOAT, \
                    gpsX FLOAT, \
                    gpsY FLOAT, \
                    publicName VARCHAR(50), \
                    endDate DATE \
                    );",
            function(err, result) {
                if (err) {
                    return console.error('Error:', err);
                }
                console.info('tblQueue processed');
            });
        console.info('DB initialised successfully');
    });
};
/*
@parameter user (firstName, lastName, gender, dob, number, email, pictureURL, serviceID, serviceName)
@parameter matchDetails (gender, locationX, locationY, endDate, publicName)
@parameter onComplete callback function(user, matchDetails)
*/
DB.prototype.addMatch = function(user, matchDetails, onComplete) {
    pg.connect(this.connString, function(err, client, done) {
        if (err) {
            return console.error('Error fetching client from pool', err);
        }
        //Insert the user entry
        var queryUsers = client.query({
            text: 'INSERT INTO tblUsers \
                (firstname, lastname, email, gender, dob, number, pictureurl, servicename, serviceid) \
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) \
                RETURNING id;',
            values: [user.firstName, user.lastName, user.email, user.gender, user.DOB, user.number, user.pictureURL, user.serviceName, user.serviceID],
            name: 'Insert user details'
        });

        queryUsers.on('error', function(err) {
            console.log('Error:', err);
        });

        //If successful
        queryUsers.on('end', function(err, result) {
            
            if (err) {
                return console.error('Error running query', err);
            }
            console.log(result.rows[0].id);
            console.log(user, 'inserted');
            //Insert match query
            var queryMatch = client.query({
                text: 'INSERT INTO tblQueue \
                (userid, genderpreference, gpsx, gpsy, publicx, publicy, publicname, enddate) \
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) \
                RETURNING id;',
                values: [],
                name: 'Insert queue request'
            });

            queryMatch.on('end', function(err, result) {
                done();
                if (err) {
                    return console.error('Error running query', err);
                }
                console.log('Inserted a user into the queue');
            });
        });
    });
};

module.exports = DB;