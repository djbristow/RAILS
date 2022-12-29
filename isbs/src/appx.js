// ISBS - IoT Subscriber Turnout Panel Button Services
// This hapi app subscribes to turnout panel button (sensors/pb) from the MQTT Broker and
// pushes them to a Vue application socket.

const Hapi = require("@hapi/hapi"),
  mqtt = require("mqtt"),
  Nes = require("@hapi/nes");

const server = new Hapi.Server({
 port: process.env.ISBS_TCP_PORT,
host: process.env.ISBS_TCP_ADDR,
  routes: {
    cors: true,
  },
});
let suburl = "ws://" + process.env.ISBS_TCP_ADDR + ":" + process.env.ISBS_TCP_PORT + "/socket.io/";
const start = async () => {
  await server.register(Nes);
  server.subscription( '/btncmsg');
  await server.start();
  console.log("ISBS started v1.0.0");
  console.log("Server running on %s", server.info.uri);
};

var client = mqtt.connect(
  "mqtt://" +
    process.env.MQTT_PORT_1883_TCP_ADDR +
    ":" +
    process.env.MQTT_PORT_1883_TCP_PORT
);

function handleMqtt(message) {
  let parsedMsg = JSON.parse(message);
  server.publish(suburl + 'btncmsg', parsedMsg);
  console.log(parsedMsg);
}

client.on("connect", function () {
  console.log("MQTT Connected");
  client.subscribe("sensors/pb");
});

client.on("message", function (topic, message) {
  return handleMqtt(message);
});

start();
