// IPAS - IoT Publish Audio Services
// This express app provides an API for Vue applications to publish 
// text to voice messages to a MQTT broker

const cors = require('cors'),
      express = require('express'),
      mqtt = require('mqtt');

// Using a unique client ID to prevent broker disconnection loops
var client = mqtt.connect('mqtt://' + process.env.MQTT_TCP_URI, { clientId: "mqtt-ipas" });
var app = express();

app.use(cors());
app.use(express.json());

var msg = null;
var topic = null;

async function handlePost(params) {
    msg = '{ "txt:"' + params.txt + '","alarm":"' +  params.alarm + '"}';
    topic = 'txt2voice/';
    console.log(`Publishing to MQTT topic: ${topic}, message: ${msg}`);
    client.publish(topic.toString(), msg);
}

client.on('connect', () => {
  console.log("MQTT Connected (IPAS)");
});

client.on('error', (error) => {
  console.error("MQTT Error (IPAS):", error);
});

// Updated route from '/to' to '/txt2voice'
app.post('/txt2voice', (req, res) => {
  console.log("Received POST request on /txt2voice with body:", req.body);
  handlePost(req.body);
  res.status(200).send({ status: 'Message published' });
});

app.listen(process.env.PORT || 3014, () => {
    console.log("IPAS started v1.1.0");
    console.log("App listening on port 3014");
});
