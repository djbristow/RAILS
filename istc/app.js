var mqtt = require('mqtt'),
  axios = require('axios');
var client = mqtt.connect('mqtt://' + process.env.MQTT_PORT_1883_TCP_ADDR + ':' + process.env.MQTT_PORT_1883_TCP_PORT, { clientId: "mqttjs01" });
let tos = [];

function rlds() {
  return axios.create({
    baseURL: 'http://' + process.env.RLDS_PORT_3006_TCP_ADDR + ':' + process.env.RLDS_PORT_3006_TCP_PORT
  })
}

function getToList() {
  return rlds().get('tolist')
}

function getTo(id) {
  return rlds().get('to_id/' + id)
}

function updateTo(params) {
  return rlds().put('update_to/' + params.id, params)
}

function getTPLList() {
  return rlds().get('tpllist')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function buildToList() {
  let turnoutPLs = [];
  var response = await getToList();
  var turnouts = response.data.turnouts;
  response = await getTPLList();
  var tplights = response.data.tplights;
  for (let i = 0; i < turnouts.length; ++i) {
    var turnout = {
      to_id: '',
      toNum: '',
      toCntlr: '',
      toState: '',
      toLock: '',
      tplNum: '',
      tplCntlr: ''
    };
    turnout.to_id = turnouts[i]._id;
    turnout.toNum = turnouts[i].toNum;
    turnout.toCntlr = turnouts[i].controller;
    turnout.toState = turnouts[i].state;
    turnout.toLock = turnouts[i].lock;
    let foundTPL = tplights.find(
      (tplight) => tplight.to_id === turnouts[i]._id
    );
    turnout.tplNum = foundTPL.tplNum;
    turnout.tplCntlr = foundTPL.controller;
    turnoutPLs.push(turnout);
  }
  return turnoutPLs
}

async function initialize() {
  while (client.connected == false) {
    await sleep(50);
    console.log('waiting for mqqt connection');
  }
  this.tos = await buildToList();
  for (let i = 0; i < this.tos.length; ++i) {
    let color = "RED"
    if (this.tos[i].toState === "CLOSED") {
      color = "GREEN"
    } else if (this.tos[i].toState === "THROWN") {
      color = "BLUE"
    }
    let msg = '{"cntrlr":"' + this.tos[i].tplCntlr
      + '","tpl":"' + this.tos[i].tplNum
      + '","color":"' + color + ',"type":"BUTTON"}';
    topic = 'acts/tpl/' + this.tos[i].tplCntlr;
    client.publish(topic.toString(), msg);
  }
  console.log('Panel lights initilized v1.1.0');
}

client.on('connect', function () {
  console.log("MQTT Connected")
  client.subscribe('sensors/toc')
  client.subscribe('sensors/pb')
  client.subscribe('acts/to/#')
})

client.on('message', function (topic, message) {
  return handleMsg(topic, message);
});

client.on("error", function (error) {
  console.log("Can't connect" + error);
  process.exit(1)
});

initialize();

async function handleMsg(topic, message) {
  let parsedMsg = ''
  let color = 'RED'
  let msg = ''
  try {
    parsedMsg = JSON.parse(message)
  } catch (err) {
    console.error(err)
  }
  let foundTos = undefined

  if (topic.includes("sensors/pb")) {
    //test to see if to is bigger or tpl is... if so build new tos then
    foundTos = this.tos.find(
      (tosfind) => (tosfind.tplNum === parsedMsg.pb && tosfind.tplCntlr === parsedMsg.cntrlr)
    );
    if (foundTos === undefined) {
      console.log("Bad msg: ")
      console.log(parsedMsg)
    } else {
      const resp = await getTo(foundTos.to_id)
      let turnout = resp.data
      let state = turnout.state
      let cmd = ''
      if (turnout.lock === "") {
        const now = new Date();
        let et = Math.round(now.getTime() / 1000);
        await updateTo({
          id: turnout._id,
          toID: turnout.toID,
          toNum: turnout.toNum,
          controller: turnout.controller,
          state: state,
          type: turnout.type,
          lock: 'ISTC',
          notes: turnout.notes,
          lastUpdate: et
        });
        if (state === "CLOSED") {
          cmd = 'THROW'
        }
        if (state === "THROWN") {
          cmd = 'CLOSE'
        }
        msg = '{"cntrlr":"' + turnout.controller
          + '","to":"' + turnout.toNum
          + '","cmd":"' + cmd + '"}'
        topic = 'acts/to/' + turnout.controller;
        client.publish(topic.toString(), msg);
      }
    }

  } else {
    let foundTPL = this.tos.find(
      (tplight) => (tplight.toCntlr === parsedMsg.cntrlr && tplight.toNum === parsedMsg.to)
    );
    if (foundTPL === undefined) {
      console.log("Bad msg: ")
      console.log(parsedMsg)
    } else {
      if (topic.includes("acts/to/")) {
        msg = '{"cntrlr":"' + foundTPL.tplCntlr
          + '","tpl":"' + foundTPL.tplNum
          + '","color":"' + color + '","type":"BUTTON"}';
        topic = 'acts/tpl/' + foundTPL.tplCntlr;
        client.publish(topic.toString(), msg);
      }
      if (topic.includes("sensors/toc")) {
        if (parsedMsg.state === "CLOSED") {
          color = 'GREEN'
        } else if (parsedMsg.state === "THROWN") {
          color = 'BLUE'
        }
        msg = '{"cntrlr":"' + foundTPL.tplCntlr
          + '","tpl":"' + foundTPL.tplNum
          + '","color":"' + color + '","type":"BUTTON"}';
        topic = 'acts/tpl/' + foundTPL.tplCntlr;
        const resp = await getTo(foundTPL.to_id);
        let to = resp.data;
        if (to.lock === "ISTC") {
          const now = new Date();
          let et = Math.round(now.getTime() / 1000);
          await updateTo({
            id: to._id,
            toID: to.toID,
            toNum: to.toNum,
            controller: to.controller,
            state: parsedMsg.state,
            type: to.type,
            lock: '',
            notes: to.notes,
            lastUpdate: et
          });
        }
        client.publish(topic.toString(), msg);
      }
    }
  }
}
