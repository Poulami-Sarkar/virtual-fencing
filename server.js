var http = require('http');
var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var query //= 'select year,count(*) journal_count from Aminer_cite_se group by year;'
var output ;
var url

var app = express();
//set view engine to ejs
app.set('view engine','ejs')

//This has to be done in order to link materialize
app.use(express.static('public'))

app.get('/',function(req,resp){

  resp.sendFile('./public/index.html',{'root':__dirname});
});

app.listen(8088);
console.log('Server running at http://127.0.0.1:8088/');