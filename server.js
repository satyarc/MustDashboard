// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var ejs = require('ejs');

const csv=require('csvtojson')

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  var locationFreq = {};  
  csv().fromFile("data/must_details.csv")
  .on("end_parsed",function(jsonArrayObj){ //when parse finished, result will be emitted here.
      /*for (location in locationFreq){
        console.log('location ' + location + ' frequency ' + locationFreq[location])
      }*/
      response.format({
        'text/html': function(){
            response.cookie("rad", JSON.stringify(locationFreq));
            response.sendFile(__dirname + '/views/index.html');
        }
    });
  })
  .on('json',(jsonObj)=>{
        var location = jsonObj['LOCATION']
        //console.log('Location ' + location)
        if (!locationFreq[location]) {
            locationFreq[location] = 0;
        }
        locationFreq[location] += 1;
  })
  .on('done',(error)=>{
      console.log('end')
  })
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
 