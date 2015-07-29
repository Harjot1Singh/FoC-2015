 var clockwork = require('clockwork')({
     key: '58ef3eed33495309d5a7ce1318a7f4c005be6c63'
 });

 //i.e use SMS.send to send it in other module
 exports.send = function(number, message) {
     /*
         Daniel's Key    : 58ef3eed33495309d5a7ce1318a7f4c005be6c63
         Jake's Key      : 2cf1417b65d94cd9ebc7d4558fd1cdea41bb3dd0
     */
     clockwork.sendSms([{
             To: number,
             Content: message,
             From: "Envolve"
         }],
         function(error, resp) {
             if (error) console.log("Error:", error);
             else console.log("Sent'", message, "' to", number);
         }
     );
 };
 