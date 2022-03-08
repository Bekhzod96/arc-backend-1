Car Controller Back end
=======================

## Build and Run

	make build
	make test
	make run

	make docker-build
	make docker-test
	make docker-run

## Deployment
This code deployed in dev3.arc.lv and responding in Http && Https queries.

	make deploy


## List of Dependencies
### Development dependencies
 - NodeJS - 10.16.0
### Core Related Packets 
 - "cors" - Avoid Cross Origin Access Issues 
 - "dotenv" - Global Variable  
 - "express" - Server response packets 
 - "mongoose" - Manipulation of the MongoDB
 - "mqtt" - Node Mqtt client packets 
 - "multer" - File handling
 - "nodemon" - Node Development Environment
 - "rxjs" - Handling Workflow 
 - "socket.io" - Handling a WebSocket communication with front end
 - "socket.io-stream" - Stream File of over web socket (It is unused for now)
 - "ws" - Standard Web Socket to make communication with IoT devices 
### Security Related Packets 
 - "bcryptjs"
 - "cookie-parser"
 - "jsonwebtoken"
 - "validator"
    
## Server Side 
pm2 - is used as production process manager for Node. js applications with a built-in load balancer.  
It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks. 

	pm2 status - get status of running services

And also it is set up Nginx in instance dev3.arc.lv in order to handle all API call handling but as IoT could not connect properly I shut down this particular service in server side.  
 All configuration file on this folder:

	/etc/nginx/sita-available/dev2.arc.lv 

### To diagnostics and run Nginx:

	systemctl status nginx - get status
	system start nginx - to start

# DataBase
To save messages and user information and get records it has been used a MongoDb. In order to get this credentials send a request to me. 

# Scaleway IoT Hub 

[https://www.scaleway.com/en/docs/scaleway-iothub/](https://www.scaleway.com/en/docs/scaleway-iothub/)  

- **MQTT**: MQTT is the standard protocol used to exchange messages. It is a publisher/subscriber protocol that is very lightweight, even for the smallest micro-controllers. It works pretty much the same as a web forum: when a client publishes a message under a topic, all the clients which had subscribed to this topic get the message.
In order to communicate with IoT device in scaleway it was set up IoT hub and this application connected to the hub as devices. All the time listening messages in this hub as this hub receives any payload it will send this message to all who subscribes to the   

- **Hub**: A Hub can be seen as an MQTT message broker that can be dedicated, highly-available, and scalable, and that integrates with Scaleway’s ecosystem.

This back end service connect to IoT hub as device and subscribed to the all topics by '+/#'. This was done because of track the history of the messages in our DB. 

**Topics** in Hub - is started with device_id which we get from IoT hub when we create a device. e.g/1b3d0160-a36c-44ba-b069-a662a8befeff/message. This was done in order to distinguish messages by device and save them accordingly in Db. After saving, in Device Detail page is showing all messaging history of the particular device.

## Current Deployment Process 
In order to deploy this application to dev3.arc.lv
- Commit and push to master branch 
- connect to server via ssh and pull the changes 
- restart pm2 by command **pm2 restart all** 

## Functionality description
**Firmware Update** - all life cycle of the firmware update 

## Flow diagram
<img src='./wwwroot/assets/fw.jpeg' raw=true arl='' />
