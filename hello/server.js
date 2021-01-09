var http=require('http');
var dt = require('./dateTime');

http.createServer(function(req,res){
    res.write('Hello World!! ');
    res.write('date and time is :'+dt.myDateTime());
    res.end();
}).listen(8080);