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
router.post('/', async (req, res) => {
    const { body } = req;
    let message;
    console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);
    if (body.NumMedia > 0) {
      message = new MessagingResponse().message("Thanks for the image! Here's one for you!");
      //message.media(goodBoyUrl);
    } else {
      message = new MessagingResponse().message('Send us an image!');
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
