// ISTS - IoT Subscriber Turnout Services
// This express app subscribes to turnout contacts (sensors/toc) from the MQTT Broker and
// pushes them to a Vue application socket.

const mqtt = require('mqtt');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer, {
     cors: {
          origin: 'http://' + process.env.MRLM_TCP_URI,
          methods: ["GET", "POST"]
     }
})

var client = mqtt.connect('mqtt://' + process.env.MQTT_TCP_URI, { clientId: "mqtt-isbs" });

function handleMqtt(message) {
     let parsedMsg = JSON.parse(message);
     io.sockets.emit('btnmsg', parsedMsg);
}

client.on('connect', function () {
     console.log("MQTT Connected")
     client.subscribe('sensors/pb')
})

client.on('message', function (topic, message) {
     return handleMqtt(message);
     client.end();
})

httpServer.listen(3012, function () {
     console.log("ISBS v1.1.11, Started")
     console.log("ISBS listening on port 3012")
});
