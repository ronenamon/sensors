const sqlite3 = require('sqlite3').verbose(); 

//return average of value by all sensors in raduis x accroding to lat and long
async function getAvg(params) {       
    console.log("start getAvg...\n"); /*with params : " , params);*/

    /* build query */

    var er = 6371;//default if not sended by user;//earth radius 6371 km - im meter 6371000  
    
    //check metric value if avalible
    if(params.metric !== undefined){
        switch (params.metric) {
            case 'm':
                er = 6371000;                    
                break;
            case 'km':
                er = 6371;
                    break;    
            default:
                er = 6371;
                break;
        }
    }

    
    params.minutes =  (params.minutes !== undefined &&  !isNaN(params.minutes) && params.minutes > -1) ? params.minutes : 5 ;// default is 5 minutes


    
    ///*Spherical Law of Cosines Formula*/
    var sql = `SELECT device_id,
                value,  
                ROUND(( ${er} * acos( cos( radians(?) ) * cos( radians( latitude ) ) 
                * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) 
                * sin(radians(latitude)) ) ),5) AS distance
                            
            FROM sensors
            where timestamp >= datetime('now' , '-${params.minutes} minutes')
            `;
                    

    try{
        return await execSql(sql,[params.lat , params.long ,params.lat],'select');
    } catch (e) {
        console.log("getAvg Error");
        throw e;
    }
}

//insert do db dummy data for testing
async function addDemoData(){
    try{
        var sql = "INSERT INTO sensors (`device_id`, `timestamp`,`latitude`, `longitude`, `value`) VALUES" + 
        "(100, datetime('now'), 32.95247811, 35.22012569, 25),"+
        "(200, datetime('now'), 32.95443762, 35.21552299, 28),"+
        "(300, datetime('now'), 32.95347401, 35.17686298, 15),"+
        "(500, datetime('now'), 32.93386939, 35.08317586, 12),"+
        "(600, datetime('now'), 32.84435757, 35.08893730, 20),"+
        "(700, datetime('now'), 33.05366374, 35.10170266, 35),"+
        "(800, datetime('now'), 32.95482492, 35.21514105, 19)";


        return await execSql(sql,[],'insert');
    } catch (e) {
        console.log("addDemoData Error");
        throw e;
    }

}

//insert data from sensor
async function addDataSensor(params){
    try{
        
        //cnt is the size of the array if some data before exist need to add them with timestamp - n as size 
        var sql = "INSERT INTO sensors (device_id, timestamp ,latitude, longitude, value) VALUES ";
        
         params.map((row)=>{
            return sql+= "("+row.device_id+",'"+ row.timestamp +"',"+ row.latitude  +","+ row.longitude  +","+ row.value+"),";
            //return [row.device_id , row.timestamp  , row.latitude  , row.longitude  , row.value];
         });
         sql = sql.slice(0, -1) //remove the last ,
         console.log(params,sql);

        return await execSql(sql,[],'insert');

    } catch (e) {
        console.log("addDataSensor Error");
        throw e;
    }
}

//execute sql query with params and return result 
async function execSql(sql, params = [],action){
    console.log("start execSql....\n");

    try{
            let db = await connectToDB();
            db.loadExtension("./extension-functions");//compiled extension for 

            switch (action) {
                case 'select':
                        return await select();
                case 'insert':
                        return await insert();
                default:
                    return false;
            }
              /*db.serialize(() => {
                // Queries scheduled here will be serialized.
                db.run(
                `CREATE TABLE IF NOT EXISTS sensors (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    device_id INTEGER,
                    timestamp TEXT,
                    latitude REAL,
                    longitude REAL,
                    value INTEGER
                )`);
             
               

            });*/

            async function select(){
                return new Promise(function(resolve, reject) {

                    db.all(sql, params,  (err,result) => {
                        if (err) {
                        console.error(err.message);
                        reject(err.message);
                        }
                        resolve(result);

                    }).close((err) => {
                        if (err) {
                            console.error("error" , err.message);
                            reject(err.message);
                        }
                        console.log('Close the database connection.');
                    });
        
                  });     
            }//end select

            async function insert(){
                return new Promise(function(resolve, reject) {

                    db.run(sql, params, function(err){
                        if (err){
                            reject(err);
                            throw err;
                        }
                        resolve(true);
                        
                    }).close((err) => {
                        if (err) {
                            console.error("error" , err.message);
                        }
                        console.log('Close the database connection.');
                    });

                  });     
            }//end insert

            
          

    }catch(e){
        console.log("execSql Error");
        throw e;
    }
}

async function connectToDB(){
    let db = null;
    try {
     db = new sqlite3.Database('sensors.db',(err) => {
        if (err) {
          console.error(err.message);
          return null;
        }
        console.log('Connected to the sensors database.'); 
      });
    }catch (e) {
        console.log(e);
        return null;
    }
    return db;  
}

module.exports = {
    getAvg:getAvg,
    addDemoData:addDemoData,
    addDataSensor:addDataSensor
 };
