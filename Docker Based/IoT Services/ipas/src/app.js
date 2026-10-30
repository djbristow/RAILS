// IPAS - IoT Publish Audio Services
// This express app prodes an API for Vue applications to publish 
// text to voice messages to a MQTT broker
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
    topic = 'txt2voice/' + params.topic;
    client.publish(topic.toString(), msg);
}

client.on('connect', () => {
  console.log("MQTT Connected");
})

app.post('/to', (req, res) => {
  handlePost(req.body);
})

app.listen(process.env.PORT || 3012)
    console.log("IPAS started v1.0.0")
    console.log("App listening on port 3012")
