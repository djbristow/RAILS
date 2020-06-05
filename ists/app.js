const mqtt = require('mqtt'),
      client = mqtt.connect('mqtt://' + process.env.MQTT_PORT_1883_TCP_ADDR + ':' + process.env.MQTT_PORT_1883_TCP_PORT),
      //lient = mqtt.connect('mqtt://127.0.0.1:1883'),
      express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server)

client.on('connect', function() {
     console.log ("MQTT Connected")
     client.subscribe('sensors/toc')
})

client.on('message', function(topic, message) {
     return handleMqtt(message);
     client.end();
})

function handleMqtt(message){
  console.log(message.toString())
 let parsedMsg = JSON.parse(message);
 io.emit('tocmsg', parsedMsg);
}

server.listen(3010, function(){
      console.log("App listening on port 3010")
});
