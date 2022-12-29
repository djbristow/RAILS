// ISBS - IoT Subscriber Turnout Panel Button Services
// This express app subscribes to turnout panel button (sensors/pb) from the MQTT Broker and
// pushes them to a Vue application socket.

const mqtt = require('mqtt'),
     app = require('express')(),
     cors = require('cors');

app.use(cors());

var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer, {
    cors: {
    origin: "http://127.0.0.1" + ':' + process.env.MRLM_TCP_PORT,
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
     console.log(message);
     client.end();
})

httpServer.listen(3012, function () {
    console.log("ISBS started v1.0.0")
    console.log("ISBS listening on port 3010")
});
