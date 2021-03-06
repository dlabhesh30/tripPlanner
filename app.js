var express = require("express");
var Uber = require('node-uber');
var path = require("path");
var bodyParser = require('body-parser');
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder(options);
const EventEmitter = require('events');
var weather=require("./weather");
var config = require('./config/config');
var apiLyftController   = require('./controllers/api/lyft');
var Lyft = require('node-lyft');
var expressLayouts=require('express-ejs-layouts');
var request = require('request');
var coordinates = [];
var placesLength;
var count = 0;
var uberCount = 0;
var uberPrices=[];

const myEmitter = new EventEmitter();
const uberEmitter = new EventEmitter();
const myEmitterXL=new EventEmitter();
const lyftEmitter=new EventEmitter();

var options = {
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var app = express();
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var uber = new Uber({

/*
>>>>>>> origin/master
    client_id: 'lGMT26zFN4YbgRPNSWR17uzAmWAo6IoT',
    client_secret: 'nTekbYYzAgC2KhZc7q4e9aPWVO5kwIXig_Bq8jZN',
    server_token: 'jvHZM2BCWNP4IcpRX2crSOoX8HpXb9vbCqCV9IMf',
    redirect_uri: 'http://localhost:5000/api/callback',
    name: 'ProjectTestApp',
    language: 'en_US', // optional, defaults to en_US
    sandbox: true // optional, defaults to false
<<<<<<< HEAD

=======
*/
     client_id: 'dLLuaHaTUPqusPd5oDsk4dNxXLAq7P9y',
     client_secret: 'RLFm-on4Eyg7QKtQ1ne3pIEpLVi4FCqrCSAwzNDe',
     server_token: 'DvXtkPFZjeub-qIDGqE477hh_PvzC7veCDWwoiza',
     redirect_uri: 'http://localhost:5000/api/callback',
     name: 'myapp3094',
     language: 'en_US', // optional, defaults to en_US
     sandbox: true      // optional, defaults to false


      /*  client_id: 'lGMT26zFN4YbgRPNSWR17uzAmWAo6IoT',
        client_secret: 'nTekbYYzAgC2KhZc7q4e9aPWVO5kwIXig_Bq8jZN',
        server_token: 'jvHZM2BCWNP4IcpRX2crSOoX8HpXb9vbCqCV9IMf',
        redirect_uri: 'http://localhost:5000/api/callback',
        name: 'ProjectTestApp',
        language: 'en_US', // optional, defaults to en_US
        sandbox: true // optional, defaults to false*/



});

app.get('/api/callback', function(request, response) {
    uber.authorization({
        authorization_code: request.query.code
    }, function(err, access_token, refresh_token) {
        if (err) {
            console.error(err);
        } else {
            // store the user id and associated access token
            // redirect the user back to your actual app
            response.redirect('/success');
        }
    });
});

app.get("/success", function (req, res) {

    res.render('pages/index');
});

app.post("/results.html", function (req, res) {
    // uber.estimates.getPriceForRoute(37.338208, -121.886329, 37.3352, -121.8811, function (err, response) {
    //     console.log(response);
    // });    
    var places = req.body.places;
    placesLength = places.length;
    
    //number of people
    var numOfPeople=req.body.noppl;
    var loworhigh=req.body.low;
    

    for (i = 0; i < places.length; i++) {
    

        var place = places[i];
        geocoder.geocode(place, function(err, res) {
            var coordinate={latitude:res[0]["latitude"],longitude:res[0]["longitude"]};
            coordinates.push(coordinate);
            count++;
            myEmitter.emit('coordinatesCaught', coordinates, count);
        });
    }
    var cost=new Array();
    var sortedCostUberX=[];
    var sortedPlacesUberX=[];
    var oricostX=[];
    var totalcostX;
    myEmitter.on('priceEstimatedUberX',function(response,i,j,places,temp){
        /* if(typeof cost[i]=="object"){

         }else{
         cost[i]=new Array();
         }*/

        cost[i][j]=response;
    
        if(temp==0){
    
            for (var i = 0; i < cost.length; i++) {
                oricostX[i]=new Array();
                for (var j = 0; j < cost[i].length; j++) {
                    if (i==j) {

                    }else{
                        oricostX[i][j]=cost[i][j];
                    }
                }
            }
            totalcostX=0;
            sortedPlacesVarX=[];
            sortedPlacesVarX[0]=0;
            var min=Number.POSITIVE_INFINITY;
            var minL=coordinates[0].latitude;
            var minM=coordinates[0].longitude;
            var incr=0;
            sortedPlacesUberX[0]=places[0];
            for (var l = 0; incr < places.length-1; incr++) {
                for (var m = 0; m < places.length; m++) {
                    if(l==m){

                    }else{

                        if(cost[l][m]<min){
                            sortedCostUberX[incr]=cost[l][m];
                            totalcostX+=cost[l][m];
                            min=cost[l][m];
                            minL=l;
                            minM=m;
                        }
                    }
                }
                //var t=places[incr+1];
                sortedPlacesUberX[incr+1]=places[minM];
                sortedPlacesVarX[incr+1]=minM;
                //places[m]=t;
                for (var i = 0; i < places.length; i++) {
                    cost[l][i]=Number.POSITIVE_INFINITY;
                    cost[i][l]=Number.POSITIVE_INFINITY;
                }

                min=Number.POSITIVE_INFINITY;
                l=minM;
            }
            
            if(totalcostX<=totalcostLyft){
                var sortedLyft=[];

                for (var i = 0; i < sortedPlacesVarX.length-1; i++) {
                    sortedLyft[i]=oricostLyft[sortedPlacesVarX[i]][sortedPlacesVarX[i+1]]/100;

                }

                res.render('pages/results',{ sorted:sortedPlacesUberX,uber:sortedCostUberX,lyft:sortedLyft});
            }else{
                var sortedX=[];

                for (var i = 0; i < sortedPlacesVarLyft.length-1; i++) {
                    sortedX[i]=oricostX[sortedPlacesVarLyft[i]][sortedPlacesVarLyft[i+1]];

                }

                res.render('pages/results',{ sorted:sortedPlacesLyft,uber:sortedX,lyft:sortedCostLyft});
            }
        }
    });

    var costLyft=new Array();
    var sortedCostLyft=[];
    var sortedPlacesLyft=[];
    var oricostLyft=[];
    var totalcostLyft;
    var sortedPlacesVarLyft;
    lyftEmitter.on('priceEstimated',function(response,i,j,places,tempLyft){
        /* if(typeof cost[i]=="object"){

         }else{
         cost[i]=new Array();
         }*/

        costLyft[i][j]=response;
        
        if(tempLyft==0){
           
            for (var i = 0; i < costLyft.length; i++) {
                oricostLyft[i]=new Array();
                for (var j = 0; j < costLyft[i].length; j++) {
                    if (i==j) {

                    }else{
                        oricostLyft[i][j]=costLyft[i][j];
                    }
                }
            }
            totalcostLyft=0;
            sortedPlacesVarLyft=[];
            sortedPlacesVarLyft[0]=0;

            var min=Number.POSITIVE_INFINITY;
            var minL=coordinates[0].latitude;
            var minM=coordinates[0].longitude;
            var incr=0;
            sortedPlacesLyft[0]=places[0];
            for (var l = 0; incr < places.length-1; incr++) {
                for (var m = 0; m < places.length; m++) {
                    if(l==m){

                    }else{

                        if(costLyft[l][m]<min){
                            sortedCostLyft[incr]=costLyft[l][m]/100;
                            totalcostLyft+=costLyft[l][m]/100;
                            min=costLyft[l][m];
                            minL=l;
                            minM=m;
                        }
                    }
                }
                //var t=places[incr+1];
                sortedPlacesLyft[incr+1]=places[minM];
                sortedPlacesVarLyft[incr+1]=minM;
                //places[m]=t;
                for (var i = 0; i < places.length; i++) {
                    costLyft[l][i]=Number.POSITIVE_INFINITY;
                    costLyft[i][l]=Number.POSITIVE_INFINITY;
                }

                min=Number.POSITIVE_INFINITY;
                l=minM;
            }
           
        }
    });
    var costXL=new Array();
    var sortedCostUberXL=[];
    var sortedPlacesUberXL=[];
    myEmitterXL.on('priceEstimatedUberXL',function(response,i,j,places,tempXL){
        /* if(typeof cost[i]=="object"){

         }else{
         cost[i]=new Array();
         }*/

        costXL[i][j]=response;
        
        if(tempXL==0){
            
            var min=Number.POSITIVE_INFINITY;
            var minL=coordinates[0].latitude;
            var minM=coordinates[0].longitude;
            var incr=0;
            sortedPlacesUberXL[0]=places[0];
            for (var l = 0; incr < places.length-1; incr++) {
                for (var m = 0; m < places.length; m++) {
                    if(l==m){

                    }else{

                        if(costXL[l][m]<min){
                            sortedCostUberXL[incr]=costXL[l][m];
                            min=costXL[l][m];
                            minL=l;
                            minM=m;
                        }
                    }
                }
                //var t=places[incr+1];
                sortedPlacesUberXL[incr+1]=places[minM];
                //places[m]=t;
                for (var i = 0; i < places.length; i++) {
                    costXL[l][i]=Number.POSITIVE_INFINITY;
                    costXL[i][l]=Number.POSITIVE_INFINITY;
                }

                min=Number.POSITIVE_INFINITY;
                l=minM;
            }
            
            res.render('pages/results',{ sorted: sortedPlacesUberX});
        }
    });
    myEmitter.on('coordinatesCaught', function(coordinates, count) {
        if(placesLength == count){
            //console.log(coordinates, places);
            //Write function calls here
            //---------
            //getting uber price
            var index=[]
            for (var i = 0; i < places.length; i++) {
                index[i]=i;
            }
            var temp=places.length*places.length-places.length;
            var tempXL=temp;
            var tempLyft=temp;
            index.forEach(function(i){
                cost[i]=new Array();
                costXL[i]=new Array();
                costLyft[i]=new Array();
                index.forEach(function(j){
                    if(i==j){

                    }else{
                        var locations = {
                            start_lat:coordinates[i].latitude,
                            start_lng:coordinates[i].longitude,
                            end_lat:coordinates[j].latitude,
                            end_lng:coordinates[j].longitude
                        }

                        request({
                            method: 'POST',
                            uri: config.LYFT_API_URI + '/oauth/token',
                            auth: {
                                username: config.LYFT_CLIENT_ID,
                                password: (config.USE_SANDBOX ? 'SANDBOX-' : '') + config.LYFT_CLIENT_SECRET
                            },
                            json: {
                                grant_type: 'client_credentials',
                                scope: 'offline public profile rides.read rides.request'
                            }
                        }, function (preAuthError, preAuthResponse, preAuthBody) {
                            if (preAuthError) {
                                res
                                    .status(preAuthResponse.statusCode)
                                    .json({meta: {success: false, error: preAuthError}});
                            } else {
                                /* begin: post-auth request */
                                options = {
                                        method: 'GET',
                                        uri: config.LYFT_API_URI + '/v1/cost',
                                        json: true,
                                        qs: locations
                                    } || {};
                                options.auth = options.auth || {bearer: preAuthBody.access_token};
                                callback = function (postAuthError, postAuthResponse, postAuthBody) {
                                    if (postAuthError) {

                                    } else {
                                        postAuthBody = postAuthBody || {};
                                        postAuthBody.meta = {success: true};
                                        tempLyft--;
                                        var type=0;
                                        if(numOfPeople<=2){
                                            type=1;
                                        }else if(numOfPeople>2 && numOfPeople<=4){
                                            type=2;
                                        }else{
                                            type=0;
                                        }
                                        lyftEmitter.emit('priceEstimated', postAuthBody.cost_estimates[type].estimated_cost_cents_max, i,j,places,tempLyft);
                                        //console.log(postAuthBody.cost_estimates[2].estimated_cost_cents_max);
                                    }
                                };
                                request(options, callback);
                            }
                        });
                        uber.estimates.getPriceForRoute(coordinates[i].latitude, coordinates[i].longitude, coordinates[j].latitude, coordinates[j].longitude, function (err, response) {
                            //console.log(response.prices[0].low_estimate);
                            //temp=response.prices[0].low_estimate;
                            //cost[i][j]=response.prices[0].low_estimate;
                            //console.log("cost["+i+"]["+j+"]:"+cost[i][j]);
                            temp--;
                            tempXL--;
                            var typeX=0;
                            if(numOfPeople<=2){
                                typeX=0;
                            }else if(numOfPeople>2 && numOfPeople<=4){
                                typeX=1;
                            }else{
                                typeX=2;
                            }
                            myEmitter.emit('priceEstimatedUberX', response.prices[typeX].high_estimate, i,j,places,temp);
                            //myEmitterXL.emit('priceEstimatedUberXL', response.prices[1].high_estimate, i,j,places,tempXL);
                        });
                        //cost[i][j]=temp;
                    }
                });

            });

            /* var price;
             var i=0;
             for (i = 1; i <= coordinates.length-1; i++) {
                 var src = coordinates[i-1];
                 console.log("src");
                 console.log(src);
                 var dest = coordinates[i];
                 console.log("des");
                 console.log(dest);
                 price=UberModule.getUberPrice(src,dest);
                 uberPrices.push(price);
                 /*uberCount++;
                 uberEmitter.emit('gotPrice', uberPrices, uberCount);
             } */

            /*
            uberEmitter.on('gotPrice', function(uberPrices, uberCount) {
            if(coordinates.length == uberCount){
            console.log("123");
            console.log(uberPrices, places);
            }
            });*/
            
            //getting weather for all places
              
            for (i = 0; i < places.length; i++) {
                var place = places[i];
                weather.getWeather(place);
            }


           /* uber.estimates.getPriceForRoute(coordinates[0].latitude, coordinates[0].longitude, coordinates[1].latitude, coordinates[1].longitude, function (err, response) {
                console.log(response);
            });*/
        }
    });
    //console.log(req.body);
    //res.sendFile(path.join(__dirname+"/views/results.html"));
});

app.get('/', function(request, response) {
    var url = uber.getAuthorizeUrl(['history','profile', 'request', 'places', 'all_trips']);
    response.redirect(url);
});

app.listen(5000, function () {
    console.log("Path Finder started at port 5000");


});


