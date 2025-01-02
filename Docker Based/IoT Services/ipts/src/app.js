// IPTS - IoT Publish Turnout Services
// This express app prodes an API for Vue applications to publish 
// turnout cmd messages to a MQTT broker
const cors = require('cors'),
      express = require('express'),
      mqtt = require('mqtt');

var client = mqtt.connect('mqtt://' + process.env.MQTT_TCP_URI, { clientId: "mqtt-ipts" });
var app = express();
    app.use(cors())
    app.use(express.json())
var msg = null;
var topic = null;

async function handlePost(params) {
    msg = '{"to":"' + params.to + '","cmd":"' + params.cmd + '"}';
    // console.log(msg);
    topic = 'acts/to/' + params.topic;
    client.publish(topic.toString(), msg);
}

client.on('connect', () => {
  console.log("MQTT Connected");
})

app.post('/to', (req, res) => {
  handlePost(req.body);
})

app.listen(process.env.PORT || 3011)
    console.log("IPTS started v2.1.11")
    console.log("App listening on port 3011")
