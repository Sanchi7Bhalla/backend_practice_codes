const express=require("express");
const https = require("https");
const bodyParser=require("body-parser");

const app=express();
 app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});
app.post("/",function(req,res){
     var city= req.body.cityName;
     const apiKey="83eac84a0cb5d2dbf379979e7fd9b8b3";
     const unit ="metric";
     const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units="+unit;
    
    https.get(url,function(response){

       console.log(response.statusCode);

       response.on("data",function(data){
           const weatherData=JSON.parse(data);
           const temp = weatherData.main.temp;
           const weatherDescription = weatherData.weather[0].description;
           const icon= weatherData.weather[0].icon;
           const imgURL="http://openweathermap.org/img/wn/" + icon + "@2x.png";
           res.write("<h1>Temperature in "+city+" is:"+ temp + "*C</h1>");
           res.write("Weather Description:"+ weatherDescription + " ");
           res.write("<img src="+imgURL+">");
           res.send();
        })
    })

})


app.listen(3000,function(){
    console.log("server started");
});