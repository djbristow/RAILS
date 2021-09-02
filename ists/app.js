const mqtt = require('mqtt'),
     app = require('express')(),
     cors = require('cors');

app.use(cors());

var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer, {
     cors: {
          origin: "http://localhost:" + process.env.MRLM_TCP_PORT,
          methods: ["GET", "POST"]
     }
})

var client = mqtt.connect('mqtt://' + process.env.MQTT_PORT_1883_TCP_ADDR + ':' + process.env.MQTT_PORT_1883_TCP_PORT);

function handleMqtt(message) {
     let parsedMsg = JSON.parse(message);
     io.sockets.emit('tocmsg', parsedMsg);
}

client.on('connect', function () {
     console.log("MQTT Connected")
     client.subscribe('sensors/toc')
})

client.on('message', function (topic, message) {
     return handleMqtt(message);
     client.end();
})

server.listen(3010, function () {
     console.log("App, version 1.2.0 listening on port 3010")
});
