const mqtt = require('mqtt'),
  client = mqtt.connect('mqtt://127.0.0.1:1883'),
  axios = require('axios')

function rlds() {
  return axios.create({
    baseURL: `http://localhost:3006`
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

function getMicroID(params) {
  return rlds().get('micro_id/' + params.id)
}

function addMicro(params) {
  return rlds().post('add_micro', params)
}

function getMicro(id) {
 return rlds().get('micro/' + id)
}

function updateMicro(params){
  return rlds().put('micro/' + params._id, params)
}

async function handleMicroMsg(message) {
  let parsedMsg = JSON.parse(message);
  const response = await getMicroID({
    id: parsedMsg.micro
  });
  const key = response.data._id;
  if (key == undefined) {
    addMicro({
      microID: parsedMsg.micro,
      microIP: parsedMsg.ip,
      et: parsedMsg.et,
      purpose: "undefined"
    });
  } else {
    const response = await getMicro(key);
    const purpose = response.data.purpose;
    updateMicro({
      _id: key,
      microID: parsedMsg.micro,
      microIP: parsedMsg.ip,
      et: parsedMsg.et,
      purpose: purpose
    });
  }
}