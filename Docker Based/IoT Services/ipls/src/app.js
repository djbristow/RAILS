// IPLS - IoT Publisher Turnout Panel Light Services
// This express app provides an API for Vue applications to publish 
// turnout panel light cmd messages to a MQTT broker
const cors = require('cors'),
      express = require('express'),
      mqtt = require('mqtt');

var client = mqtt.connect('mqtt://' + process.env.MQTT_PORT_1883_TCP_ADDR + ':' + process.env.MQTT_PORT_1883_TCP_PORT, { clientId: "mqttjs03" });
var app = express();
    app.use(cors())
    app.use(express.json())
var msg = null;
var topic = null;

async function handlePost(params) {
    msg = '{"tplNum":"' + params.tplNum + '","color":"' + params.color + '"}';
    // console.log(msg);
    topic = 'acts/tpl/' + params.topic;
    client.publish(topic.toString(), msg);
}

client.on('connect', () => {
  console.log("MQTT Connected");
})

app.post('/tpl', (req, res) => {
  handlePost(req.body);
})

app.listen(process.env.PORT || 3013)
    console.log("IPLS started v1.0.11")
    console.log("App listening on port 3013")
