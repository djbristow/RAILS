// This express app prodes an API for Vue applications to publish 
// turnout cmd messages to a MQTT broker
const axios = require('axios'),
      cors = require('cors'),
      express = require('express'),
      mqtt = require('mqtt');

var client = mqtt.connect('mqtt://' + process.env.MQTT_PORT_1883_TCP_ADDR + ':' + process.env.MQTT_PORT_1883_TCP_PORT, { clientId: "mqttjs02" });
var app = express();
    app.use(cors())
    app.use(express.json())
var msg = null;
var topic = null;

function rlds() {
  return axios.create({
    baseURL: 'http://' + process.env.RLDS_PORT_3006_TCP_ADDR + ':' + process.env.RLDS_PORT_3006_TCP_PORT
  })
}

function getTo (id) {
  return rlds().get('to_id/' + id)
}

function updateTo (params) {
  return rlds().put('update_to/' + params.id, params)
}

async function handlePost(params) {
  const now = new Date();
  const resp = await getTo(params.id);
  var turnout = resp.data;
  if (turnout.lock === ''){
    var et =  Math.round(now.getTime() / 1000);
    updateTo ({
      id: turnout._id,
      toID: turnout.toID,
      toNum: turnout.toNum,
      controller: turnout.controller,
      state: turnout.state,
      type: turnout.type,
      lock: params.src,
      notes: turnout.notes,
      lastUpdate: et
    });
    msg = '{"cntrlr":"' +  turnout.controller + '","to":"' + params.to + '","cmd":"' + params.cmd + '"}';
    // console.log(msg);
    topic = 'acts/to/' + params.topic;
    client.publish(topic.toString(), msg);
  }
}

client.on('connect', () => {
  console.log("MQTT Connected");
})

app.post('/to', (req, res) => {
  handlePost(req.body);
})

app.listen(process.env.PORT || 3011)
console.log("IPTS started v1.1.6")
