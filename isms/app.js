const mqtt = require('mqtt'),
      client = mqtt.connect('mqtt://' + process.env.MQTT_PORT_1883_TCP_ADDR + ':' + process.env.MQTT_PORT_1883_TCP_PORT),
      express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server)

client.on('connect', function() {
     console.log ("MQTT Connected")
     client.subscribe('micros')
})

client.on('message', function(topic, message) {
     return handleMicroMsg(message);
     client.end();
})

function handleMicroMsg(message){
  console.log(message.toString())
 let parsedMsg = JSON.parse(message);
 io.emit('rfidmsg', parsedMsg);
}

server.listen(3009, function(){
      console.log("App listening on port 3009")
});
