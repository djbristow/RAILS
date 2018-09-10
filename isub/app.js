const mqtt = require('mqtt'),
      client = mqtt.connect('mqtt://127.0.0.1:1883'),
      express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server)

client.on('connect', function() {
     console.log ("MQTT Connected")
     client.subscribe('sensors/rfid')
})

client.on('message', function(topic, message) {
     return handleRfid(message);
     client.end();
})

function handleRfid(message){
  console.log(message.toString())
 let parsedMsg = JSON.parse(message);
 io.emit('rfidmsg', parsedMsg);
}

server.listen(3005, function(){
      console.log("App listening on port 3005")
});
