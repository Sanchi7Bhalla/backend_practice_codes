var http=require('http');
var dt = require('./dateTime');

http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type': 'text/html'});
    res.write('Hello World!! ');
    res.write('date and time is :'+dt.myDateTime());
    res.end();
}).listen(8080);