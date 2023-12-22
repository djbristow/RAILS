// ISRS IoT Subscriber RFID Services 
// This is an Express application that subscribes to RFID messages from the MQTT Broker 
// and sends them to a web application using web sockets.

const mqtt = require('mqtt'),     
      app = require('express')(),
      cors = require('cors');
      app.use(cors());

var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer, {
  cors: {
    origin: "http://localhost:" + process.env.RSRM_TCP_PORT,
    methods: ["GET", "POST"]
  }
})

var client = mqtt.connect('mqtt://' + process.env.MQTT_PORT_1883_TCP_ADDR + ':' + process.env.MQTT_PORT_1883_TCP_PORT);

client.on('connect', function() {
     console.log("MQTT Connected")
     client.subscribe('sensors/rfid')
})

client.on('message', function(topic, message) {
     return handleRfid(message);
     client.end();
})

function handleRfid(message){
  console.log(message.toString())
 let parsedMsg = JSON.parse(message);
 io.sockets.emit('rfidmsg', parsedMsg);
}

httpServer.listen(3005, function() {
      console.log("ISRS v1.2.17, Started")
      console.log("ISRS listening on port 3005")
});
