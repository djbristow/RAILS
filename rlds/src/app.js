// This express app provides an API for Vue applications to get and put data
// to the MongoDB
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const mongodb_conn_module = require("./mongodbConnModule");
var db = mongodb_conn_module.connect();

var Turnout = require("../models/Turnout");
var Micro = require("../models/Micro");
var TPLight = require("../models/TPLight");

// The following CRUD functions handle data in the turnouts collection
app.get("/tolist", async (req, res) => {
  const tos = await Turnout.find().sort({
    controller: 1,
    toNum: 1,
  });
  res.send(tos);
});
app.post("/add_to", async (req, res) => {
  await Turnout.create(req.body);
  res.send({
    success: true,
  });
});
app.get("/to_id/:id", async (req, res) => {
  let to = await Turnout.findById(req.params.id);
  res.send(to);
});
app.get("/to/:id", async (req, res) => {
  let to = await Turnout.findOne({
    toID: req.params.id,
  });
  res.send(to);
});
app.get("/to_ident/:id", async (req, res) => {
  let to = req.params.id.split("-");
  let turnout = await Turnout.findOne({
    controller: to[0],
    toNum: to[1],
  });
  res.send(turnout);
});
app.get("/to_name/:id", async (req, res) => {
  let to = await Turnout.findOne({
    toID: req.params.id,
  });
  res.send(to);
});
app.put("/update_to/:id", async (req, res) => {
  let turnout = await Turnout.findById(req.body._id);
  turnout._id = req.body._id;
  turnout.toID = req.body.toID;
  turnout.toNum = req.body.toNum;
  turnout.controller = req.body.controller;
  turnout.state = req.body.state;
  turnout.type = req.body.type;
  turnout.lock = req.body.lock;
  turnout.notes = req.body.notes;
  turnout.lastUpdate = req.body.lastUpdate;
  turnout.save();
  res.send({
    success: true,
  });
});
app.delete("/to/:id", async (req, res) => {
  console.log("Deleting " + req.params.id);
  await Turnout.deleteOne({
    _id: req.params.id,
  });
  console.log("Deleted");
  res.send({
    success: true,
  });
});

// The following CRUD functions handle data in the micros collection
app.get("/microlist", async (req, res) => {
  const micros = await Micro.find().sort({
    _id: -1,
  });
  res.send(micros);
});
app.get("/micro/:id", async (req, res) => {
  const micro = Micro.findById(req.params.id);
  res.send(micro);
});
app.get("/micro_name/:id", async (req, res) => {
  const micro = await Micro.findOne().where("microID").equals(req.params.id);
  res.send(micro);
});
app.get("/micro_id/:id", async (req, res) => {
  const micro = await Micro.findOne({
    _id: req.params.id,
  });
  res.send(micro);
});
app.post("/add_micro", async (req, res) => {
  await Micro.create(req.body);
  res.send({
    success: true,
  });
});
app.put("/update_micro/:id", async (req, res) => {
  const micro = await Micro.findById(req.body._id);
  micro._id = req.body._id;
  micro.microID = req.body.microID;
  micro.microIP = req.body.microIP;
  micro.et = req.body.et;
  micro.purpose = req.body.purpose;
  micro.status = req.body.status;
  micro.sensorLoc = req.body.sensorLoc;
  micro.notes = req.body.notes;
  micro.lastUpdate = req.body.lastUpdate;
  await micro.save();
  res.send({
    success: true,
  });
});
app.delete("/micro/:id", async (req, res) => {
  await Micro.deleteOne({
    _id: req.params.id,
  });
  res.send({
    success: true,
  });
});

// The following CRUD functions handle data in the tplights collection
app.get("/tpllist", async (req, res) => {
  const tplights = await TPLight.find().sort({
    controller: 1,
    toNum: 1,
  });
  res.send(tplights);
});
app.get("/tpl_id/:id", async (req, res) => {
  let tpl = await TPLight.findById(req.params.id);
  res.send(tpl);
});
app.get("/tpl_num/:id", async (req, res) => {
  let tpl = await TPLight.findOne({
    tplNum: req.params.id,
  });
  res.send(tpl);
});
app.post("/add_tpl", async (req, res) => {
  await TPLight.create(req.body);
  res.send({
    success: true,
  });
});
app.put("/update_tpl/:id", async (req, res) => {
  let tpl = await TPLight.findById(req.body._id);
  tpl.to_id = req.body.to_id;
  tpl.tplNum = req.body.tplNum;
  tpl.controller = req.body.controller;
  tpl.panelName = req.body.panelName;
  tpl.panelNum = req.body.panelNum;
  tpl.lightNum = req.body.lightNum;
  tpl.save();
  res.send({
    success: true,
  });
});
app.delete("/tpl/:id", async (req, res) => {
  TPLight.deleteOne({
    _id: req.params.id,
  });
  res.send({
    success: true,
  });
});

app.listen(process.env.PORT || 3006);
