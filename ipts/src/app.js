// This express app prodes an API for Vue applications to publish 
// turnout cmd messages to a MQTT broker
const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      app = express(),
      axios = require('axios'),
      mqtt = require('mqtt'),
      client = mqtt.connect('mqtt://127.0.0.1:1883')
      
app.use(bodyParser.json())
app.use(cors())

var msg = null;
var topic = null;

function rlds() {
  return axios.create({
    baseURL: `http://localhost:3006`
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
    msg = '{"to":"' + params.to + '","cmd":"' + params.cmd + '"}';
    topic = 'acts/to/' + params.topic;
    client.publish(topic.toString(), msg);
    client.end();
  }
}

client.on('connect', () => {
  console.log("MQTT Connected");
})

app.post('/to', (req, res) => {
  console.log(req.body.id);
  handlePost(req.body);
})

app.listen(process.env.PORT || 3011)
