// ISMS IoT Subscriber Micro-controller Services
// This is an express application that subscribes to micro messages from the MQTT Broker 
// and adds or updates the micros collection via RLDS services.

const mqtt = require('mqtt'),
  axios = require('axios');

var client = mqtt.connect('mqtt://' + process.env.MQTT_TCP_URI, { clientId: "mqtt-isms" });
console.log("ISMS v3.0.13, Started")
setTimeout(checkStatus, 6000);

function rlds() {
  return axios.create({
    baseURL: 'http://' + process.env.RLDS_TCP_URI
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
  let status = "";
  let response = await fetchMicroList();
  let micros = response.data
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

function getMicroByName(name) {
  console.log(name)
  return rlds().get('micro_name/' + name)
}

function addMicro(params) {
  console.log("addMicro")
  return rlds().post('add_micro', params)
}

async function updateMicro(params) {
  return await rlds().put('update_micro/' + params._id, params)
}

async function handleMicroMsg(message) {
  let parsedMsg = JSON.parse(message);
  let response = await getMicroByName(parsedMsg.mcntrlr);
  var micro = response.data;
  if (micro._id == undefined) {
    addMicro({
      microID: parsedMsg.mcntrlr,
      microIP: parsedMsg.ip,
      et: parsedMsg.et,
      purpose: "",
      sensorLoc: "",
      status: "Up"
    });
  } else {
    var ip = micro.microIP;
    if (micro.msgType === "initial"){
      ip = parsedMsg.ip;
    }
    updateMicro({
      _id: micro._id,
      microID: parsedMsg.mcntrlr,
      microIP: ip,
      et: parsedMsg.et,
      purpose: micro.purpose,
      sensorLoc: micro.sensorLoc,
      status: "Up"
    });
  }
}
