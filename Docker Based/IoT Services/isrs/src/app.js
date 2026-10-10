// ISRS IoT Subscriber RFID Services 
// This is an Express application that subscribes to RFID messages from the MQTT Broker 
// and sends them to a web application using web sockets.

const mqtt = require('mqtt');
const express = require('express');
const cors = require('cors'); // This is for Express routes, not Socket.IO server directly
const app = express();
app.use(express.json());
app.use(cors()); // This applies CORS headers to your Express HTTP routes

var httpServer = require('http').createServer(app);
// Extra allowed origins for additional client apps, comma separated, e.g.
// EXTRA_CORS_ORIGINS="http://localhost:3003,http://myapp.local"
const extraOrigins = (process.env.EXTRA_CORS_ORIGINS || '')
  .split(',').map(s => s.trim()).filter(Boolean);

var io = require('socket.io')(httpServer, {
  cors: {
    origin: [
      "http://localhost:3002",  // Allow mrlm Vite dev server
      "http://127.0.0.1:3002",  // Allow alternate localhost IP for dev server
      "http://localhost",       // For Nginx proxy in production
      "http://127.0.0.1",       // For Nginx proxy in production
      "http://localhost:3020",  // For Vite mrom dev server
      "http://127.0.0.1:3020",  // For Vite mrom dev server
      ...extraOrigins,
    ],
    methods: ["GET", "POST"]
  }
});

var client = mqtt.connect('mqtt://' + process.env.MQTT_TCP_URI, { clientId: "mqtt-isrs" });

client.on('connect', function () {
  console.log("MQTT Connected");
  client.subscribe('sensors/rfid/#');
  console.log("Subscribed to 'sensors/rfid/#' topic.");
});

client.on('message', function (topic, message) {
  console.log(`Received MQTT message on topic ${topic}: ${message.toString()}`);
  handleRfid(message);
});

function handleRfid(message) {
  console.log("Handling RFID message:", message.toString());
  let parsedMsg;
  try {
    parsedMsg = JSON.parse(message);
  } catch (e) {
    console.error("Failed to parse RFID message as JSON:", e, message.toString());
    return; // Stop processing if message is not valid JSON
  }
  io.sockets.emit('rfidmsg', parsedMsg);
  console.log("Emitted 'rfidmsg' to Socket.IO clients:", parsedMsg);
}

io.on('connection', function (socket) {
  console.log(`Client connected: ${socket.id} (total: ${io.engine.clientsCount})`);
  socket.on('disconnect', function () {
    console.log(`Client disconnected: ${socket.id} (total: ${io.engine.clientsCount})`);
  });
});

httpServer.listen(3005, function () {
  console.log("ISRS v2.2.1, Started");
  console.log("ISRS listening on port 3005");
});
