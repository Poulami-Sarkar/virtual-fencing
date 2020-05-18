var http = require('http');
var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
const { urlencoded } = require('body-parser');
var message = require('messaging')
var nodemailer = require('nodemailer');

// Node mailer
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'poulamirulz@gmail.com',
    pass: 'Rollercoaster47'
  }
});


var app = express();
app.use(urlencoded({ extended: false }));

console.log("Starting up!")
//set view engine to ejs
app.set('view engine','ejs')

//This has to be done in order to link materialize
app.use(express.static('public'))
app.use(message.router);

app.get('/',function(req,resp){
  resp.sendFile('./public/index.html',{'root':__dirname});
});

app.listen(8088);
console.log('Server running at http://127.0.0.1:8088/');

/*
// All other get and put requests
*/

// Alert when user enters a restricted area
app.get('/data',function(req,resp){

  // Extract data from the query string
  msg = req.query.msg;
  no = "+"+req.query.no.toString();
  email = req.query.email;

  // Responsr sent backt to main.js
  resp.send('GET request to the homepage '+msg);
  console.log(no,msg)

  var mailOptions = {
    from: 'poulamisarkar101@gmail.com',
    to: email,
    subject: 'ALERT!',
    text: 'Movement detected in restricted area'
  };

  if (msg=='true'){
    // Send Whatsapp message (Uncomment next line to send whatsapp message)
    //message.send_whatsapp('Movement detected in restricted area',no);
    // Send email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
});

//message.bounds.push('[{"lat":12.886877526316793,"lng":77.59036040663413},{"lat":12.88727495285282,"lng":77.59036577105216},{"lat":12.887112844736665,"lng":77.59058034777335}]')
message.bounds.push('[{"lat":123,"lng":213},{"lat":23,"lng":13}]')
// Send lat-lng bounds
app.get('/bounds',function(req,resp){  
  resp.send(JSON.stringify(message.bounds));
});

