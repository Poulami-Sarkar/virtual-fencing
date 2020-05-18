const http = require('http');
const express = require('express');

// Variables for Receiving a message
const { MessagingResponse } = require('twilio').twiml;
const router = express.Router();

// Variables for Sending a message
accountSid = 'AC5f2922f3eb272ad03d6679b2df27ca0c';
const authToken = '65fc00134736043d3c09ef65ca53223f';
const client = require('twilio')(accountSid, authToken);

// Receiving a message
var bounds=[];
router.post('/', async (req, res) => {
    const { body } = req;
    let message;
    var msg = req.body.Body;
    var result;
    console.log(`Incoming message from ${req.body.From}: ${msg}`);
    if (msg){
      email = msg.match(/^Email: (.*@*.)/);
      bound = msg.match(/^Bounds: (.*)/);
    } 
    if(email && email.length > 1) {
        message = new MessagingResponse().message("https://9e3a7839.ngrok.io?no="+req.body.From.toString().slice(10)+"&email="+email[1]);
      } 
    else if(bound){
      var obj = JSON.parse(bound[1]);
      if (obj.length >2){
        bounds.push(bound[1])
        message = new MessagingResponse().message('coordinates recieved: '+ bound[1]);
      }
      else
        message = new MessagingResponse().message('Bounds format Bounds: [{"lat":123,"lng":213},{"lat":23,"lng":13},{"lat":12,"lng":2}] \n Specify minimum 3 coordinates');
    }
    else {
        message = new MessagingResponse().message("https://9e3a7839.ngrok.io?no="+req.body.From.toString().slice(10));
      }
    
    res.set('Content-Type', 'text/xml');
    res.send(message.toString()).status(200);
  });
  
// Sending a whatsapp message
function send_whatsapp(msg,number){
    client.messages
  .create({
     from: 'whatsapp:+14155238886',
     body: msg.toString(),
     to: 'whatsapp:'+number.toString()
   })
  .then(message => console.log(message.sid));    
}

exports.router = router;
exports.send_whatsapp = send_whatsapp;
exports.bounds = bounds;