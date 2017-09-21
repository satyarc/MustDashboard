// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const csv=require('csvtojson')
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

function processRequest(request, response,path) {
  var mustMemeberCounts ={};
  var locationFreq = {};  
  var genderCount = {};
  var membershipTypeCount = {}
  var referenceCount = {}
  csv().fromFile("data/must_details.csv")
  .on("end_parsed",function(jsonArrayObj){ //when parse finished, result will be emitted here.
      response.format({
        'text/html': function(){
            mustMemeberCounts['location'] = locationFreq;
            mustMemeberCounts['gender'] = genderCount;
            mustMemeberCounts['membership'] = membershipTypeCount;
            mustMemeberCounts['reference'] = referenceCount;
            response.cookie("rad", JSON.stringify(mustMemeberCounts));
            response.sendFile(__dirname + path);
        }
    });
  })
  .on('json',(jsonObj)=>{
        var location = jsonObj['LOCATION'];
        var gender = jsonObj['GENDER'];
        var membership = jsonObj['MEMBERSHIP_TYPE'];
        var reference = jsonObj['REFERENCE'];
        if (!locationFreq[location]) {
            locationFreq[location] = 0;
        }
        locationFreq[location] += 1;
        if (!genderCount[gender]) {
            genderCount[gender] = 0;
        }
        genderCount[gender] += 1;
        if (!membershipTypeCount[membership]) {
            membershipTypeCount[membership] = 0;
        }
        membershipTypeCount[membership] += 1;
        if (!referenceCount[reference]) {
            referenceCount[reference] = 0;
        }
        referenceCount[reference] += 1;
  })
  .on('done',(error)=>{
      console.log('end')
  })
}
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  processRequest(request, response,'/views/index.html');
});

app.get("/location", function (request, response) {
  processRequest(request, response,'/views/location.html');
});

app.get("/gender", function (request, response) {
  processRequest(request, response,'/views/gender.html');
});

app.get("/membership", function (request, response) {
  processRequest(request, response,'/views/membership.html');
});

app.get("/reference", function (request, response) {
  processRequest(request, response,'/views/reference.html');
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
 