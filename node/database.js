var pg = require("pg");

var db = function() {
    if (process.env.development == "true") {
        //Database in C9 environment - remember to set development = true in environment
        this.connString = "postgres://postgres:postgres@localhost/biscuit";
    }
    else {
        //TBC username + password + ip
        this.connString = "postgres://postgres:postgres@randomhost/biscuit";
    };

};

db.protoype.connect = function() {

};

db.prototype.setupDB = function() {
    var client = new pg.Client(this.connString);
    client.connect(function(err) {
        if (err) {
            return console.error('Could not connect to postgres', err);
        }
        client.query("SELECT COUNT(DISTINCT 'table_name') \
        FROM 'information_schema'.'columns' \
        WHERE 'table_schema' = 'biscuit'", );
        
        client.query("CREATE TABLE tblUsers  ( \
                    uid SERIAL, \
                    gender INT, \
                    firstName VARCHAR(50), \
                    lastName VARCHAR(50), \
                    dob DATE, \
                    number VARCHAR(20), \
                    email VARCHAR(100), \
                    serviceID VARCHAR(50), \
                    serviceName VARCHAR(20) \
                )", function(err, result) {
            if (err) {
                return console.error('', err);
            }
            console.log('Created rows');
            client.end();
        });
    });
};

module.exports = db;