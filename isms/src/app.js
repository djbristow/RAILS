// ISMS IoT Subscriber Micro-controller Services
// This is an express application that subscribes to micro messages from the MQTT Broker 
// and adds or updates the micros collection via RLDS services.

const mqtt = require('mqtt'),
  axios = require('axios');

var client = mqtt.connect('mqtt://' + process.env.MQTT_PORT_1883_TCP_ADDR + ':' + process.env.MQTT_PORT_1883_TCP_PORT, { clientId: "mqttjs02" });
console.log("ISMS v2.1.3, Started")
setTimeout(checkStatus, 6000);

function rlds() {
  return axios.create({
    baseURL: 'http://' + process.env.RLDS_PORT_3006_TCP_ADDR + ':' + process.env.RLDS_PORT_3006_TCP_PORT
  })
}

client.on('connect', function () {
  console.log("MQTT Connected")
  client.subscribe('micros')
})

client.on('message', function (topic, message) {
  return handleMicroMsg(message);
  client.end();
})

async function checkStatus() {
  const cet = Math.round(Date.now()/1000);
  // console.log(cet);
  let status = "";
  let response = await fetchMicroList();
  let micros = response.data.micros
  micros.forEach(micro => {
    if ((cet - micro.et) < 300) {
      status = "Up"
    } else if ((cet - micro.et) < 600) {
      status = "Late"
    } else {
      status = "Down"
    }
    if (micro.status !== status) {
      micro.status = status;
      updateMicro(micro);
    }
  })
  setTimeout(checkStatus, 120000);
}

function fetchMicroList() {
  return rlds().get('microlist/')
}

function getMicroID(params) {
  console.log(params)
  return rlds().get('micro_id/' + params.id)
}

function addMicro(params) {
  return rlds().post('add_micro', params)
}

function getMicro(id) {
  return rlds().get('micro/' + id)
}

async function updateMicro(params) {
  return rlds().put('update_micro/' + params._id, params)
}

async function handleMicroMsg(message) {
  let parsedMsg = JSON.parse(message);
  let response = await getMicroID({
    id: parsedMsg.sensor
  });
  let key = response.data._id
  if (key == undefined) {
    addMicro({
      microID: parsedMsg.sensor,
      microIP: parsedMsg.ip,
      et: parsedMsg.et,
      purpose: "",
      sensorLoc: "",
      status: "Up"
    });
  } else {
    let response = await getMicro(key);
    let purpose = response.data.purpose;
    let sensorLoc = response.data.sensorLoc;
    let status = "Up";
    updateMicro({
      _id: key,
      microID: parsedMsg.sensor,
      microIP: parsedMsg.ip,
      et: parsedMsg.et,
      purpose: purpose,
      sensorLoc: sensorLoc,
      status: status
    });
  }
}
