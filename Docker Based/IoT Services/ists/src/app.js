// ISTS - IoT Subscriber Turnout Services
// This express app subscribes to turnout contacts (sensors/toc) from the MQTT Broker and
// pushes them to a Vue application using a web socket.

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
})

var client = mqtt.connect('mqtt://' + process.env.MQTT_TCP_URI, { clientId: "mqtt-ists" });

client.on('connect', function () {
     console.log("MQTT Connected")
     client.subscribe('sensors/toc')
})

client.on('message', function (topic, message) {
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
  io.sockets.emit('tocmsg', parsedMsg);
  console.log("Emitted 'tocmsg' to Socket.IO clients:", parsedMsg);
}

httpServer.listen(3010, function () {
     console.log("ISTS v2.0.0, started")
     console.log("ISTS listening on port 3010")
});
