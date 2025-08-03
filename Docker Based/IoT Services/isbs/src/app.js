// ISTS - IoT Subscriber Turnout Services
// This express app subscribes to push button contacts (sensors/pb) from the MQTT Broker and
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
          origin: [
      // Allow the origin where your frontend SPA is served from
      "http://localhost", // For local access via Nginx proxy
      "http://127.0.0.1", // Another common local access IP
      // If you access your Nginx proxy via a specific LAN IP (e.g., 192.168.4.200)
      
      // Keep existing RSRM_TCP_URI
      "http://" + process.env.RSRM_TCP_URI,
    ],
          methods: ["GET", "POST"]
     }
});

var client = mqtt.connect('mqtt://' + process.env.MQTT_TCP_URI, { clientId: "mqtt-isbs" });

client.on('connect', function () {
     console.log("MQTT Connected")
     client.subscribe('sensors/pb')
     console.log("Subscribed to 'sensors/pb' topic.");})

client.on('message', function (topic, message) {
     console.log(`Received MQTT message on topic ${topic}: ${message.toString()}`);
     return handleMqtt(message);
})

function handleMqtt(message) {
     console.log("Handling push button contacts:", message.toString());
  let parsedMsg;
  try {
    parsedMsg = JSON.parse(message);
  } catch (e) {
    console.error("Failed to parse push button contacts message as JSON:", e, message.toString());
    return; // Stop processing if message is not valid JSON
  }
  io.sockets.emit('btnmsg', parsedMsg);
  console.log("Emitted 'btnmsg' to Socket.IO clients:", parsedMsg);
}

httpServer.listen(3012, function () {
     console.log("ISBS v2.0.0, Started")
     console.log("ISBS listening on port 3012")
});
