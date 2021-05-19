SELECT id, device_id, timestamp, latitude, longitude, value
FROM sensors;


INSERT INTO sensors (device_id, timestamp ,latitude, longitude, value) VALUES 
(20,'2021-05-19 22:15:00',31.982237,34.74284468,34),
(20,'2021-05-19 22:16:00',31.982237,34.74284468,25),
(20,'2021-05-19 22:17:00',31.982237,34.74284468,15);



INSERT INTO `sensors` (`device_id`, `timestamp`, `latitude`, `longitude`, `value`) VALUES
(100, datetime('now' ), 32.95247811, 35.22012569, 19),
(200, datetime('now' ), 32.95257670, 35.2221844374, 14),
(300, datetime('now' ), 32.95482492, 35.2151410555, 15),
(400, datetime('now' ), 32.95347401, 35.1768629840, 16),
(500, datetime('now' ), 32.93386939, 35.0831758670, 17),
(600, datetime('now' ), 32.84435757, 35.0889373051, 18),
(700, datetime('now' ), 33.05366374, 35.1017026634, 19);

select datetime('now');


SELECT id,device_id,
                value,  
                ( 6371 * acos( cos( radians(32.95247811) ) * cos( radians( latitude ) ) 
                * cos( radians( longitude ) - radians(35.2201256) ) + sin( radians(32.95247811) ) 
                * sin(radians(latitude)) ) ) AS distance
                            
            FROM sensors
            where 'timestamp' >= datetime('now' , '5 minutes')
            group by device_id ;
           
           
 DELETE FROM sensors
WHERE device_id IN (100,200,300,400,500,600,700);






SELECT id, device_id, "timestamp", latitude, longitude, value
FROM sensors;


INSERT INTO sensors (device_id, timestamp ,latitude, longitude, value) VALUES 
(20,'2021-05-19 22:15:00',31.982237,34.74284468,34),
(20,'2021-05-19 22:16:00',31.982237,34.74284468,25),
(20,'2021-05-19 22:17:00',31.982237,34.74284468,15);



INSERT INTO `sensors` (`device_id`, `timestamp`, `latitude`, `longitude`, `value`) VALUES
(100, datetime('now' ), 32.95247811, 35.22012569, 19),
(200, datetime('now' ), 32.95257670, 35.2221844374, 14),
(300, datetime('now' ), 32.95482492, 35.2151410555, 15),
(400, datetime('now' ), 32.95347401, 35.1768629840, 16),
(500, datetime('now' ), 32.93386939, 35.0831758670, 17),
(600, datetime('now' ), 32.84435757, 35.0889373051, 18),
(700, datetime('now' ), 33.05366374, 35.1017026634, 19);

select  datetime('now','-5 minutes');
select  datetime('now');


SELECT 
id,
device_id,
timestamp,
                value,  
                ( 6371 * acos( cos( radians(32.95247811) ) * cos( radians( latitude ) ) 
                * cos( radians( longitude ) - radians(35.2201256) ) + sin( radians(32.95247811) ) 
                * sin(radians(latitude)) ) ) AS distance
                            
            FROM sensors
            where timestamp >= datetime('now' , '-6 minutes')
            group by device_id ;
           
           
           
 DELETE FROM sensors
WHERE device_id IN (100,200,300,400,500,600,700,800);
          





