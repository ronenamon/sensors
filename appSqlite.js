'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const func = require("./lib/functions");//get all functions
var port = 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

startProcess().catch(e=> {
    console.log(e);
});

async function startProcess() {

let server = app.listen(port, function () {
    console.log("http server work on port %s", server.address().port)
 });

app.get('/',async function (req, res) {
    res.json({"status":true,'msg':'work'});
});


//add dummy data
app.get('/demoData', async function (req, res) {
    try{
        var db_add_res =  await func.addDemoData();
        res.json({"status":true,"msg":"done demo add" ,"data":db_add_res[0]});
        
    } catch (e) {
        console.log("runProcess Error");
        throw e;
    }
 })

 //http://127.0.0.1:7070/getAvg?lat=32.95247811&long=35.2201256&metric=m&minutes=5&inRadius=500
 app.get('/getAvg',async function (req, res) {

    var params =  {
        "lat":req.query.lat , 
        "long":req.query.long ,
        "inRadius":req.query.inRadius,
        "minutes":req.query.minutes , 
        "metric":req.query.metric
    };  

    
    if(req.query.lat !== undefined && req.query.long !== undefined){

        try {
                let sumValue = 0 , cnt = 0;
                let response_date = [];//rows in radius for response testing
                let data = await func.getAvg(params);

              // default is 1 m or km according to metric by user
               params.inRadius = (params.inRadius !== undefined &&  !isNaN(params.inRadius) && params.inRadius > -1 ) ? params.inRadius : 1;
               
               if(data  !== undefined && data.length ){
                    data.forEach(element => {
                        if(element.distance <= params.inRadius){
                            sumValue += element.value;
                            cnt++;
                            //element.distance = element.distance.toFixed(5);
                            response_date.push(element);
                        }
                    });
                }
              

                if(cnt){
                   /* console.log(sumValue , cnt);
                    console.log("AVG : ",(sumValue/cnt));*/
                    res.json({"status":true,"average":(sumValue/cnt) ,"data":response_date});

                }else{
                    res.json({"status":true,"average":0 ,"data":[]});
                }
         
       } catch (e) {
           console.log("error.. : ", e);
           res.send("Error!");
       }

    }else{
        res.json({"status":false,"msg":"lat and long is missing","data":[]});
    }

 });

 //get data from sensor 
 app.post('/sensorData', async function (req, res) {
   var params = [];
    try{
        if(req.body.length !== undefined && req.body.length){
            req.body.forEach(elm=>{
                    params.push({
                        "device_id":elm.device_id,
                        "timestamp":elm.timestamp , 
                        "latitude":elm.latitude , 
                        "longitude":elm.longitude ,
                        "value":elm.value 
                    })
            });
        }

        let db_add_res =  await func.addDataSensor(params);
        res.json({"status":true,"msg":"OK"});
        console.log("done sensor add" , db_add_res);
        
    } catch (e) {
        console.log("runProcess Error");
        throw e;
    }
 })



}