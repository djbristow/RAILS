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
app.get("/to_id/:id", (req, res) => {
  Turnout.findById(req.params.id, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post);
  });
});
app.get("/to/:id", (req, res) => {
  Turnout.findOne(
    {
      toID: req.params.id,
    },
    "_id",
    function (error, post) {
      if (error) {
        console.error(error);
      }
      res.send(post);
    }
  );
});
app.get("/to_ident/:id", (req, res) => {
  let to = req.params.id.split("-");
  Turnout.findOne(
    {
      controller: to[0],
      toNum: to[1],
    },
    function (error, post) {
      if (error) {
        console.error(error);
      }
      res.send(post);
    }
  );
});
app.get("/to_name/:id", (req, res) => {
  Turnout.findOne(
    {
      toID: req.params.id,
    },
    function (error, post) {
      if (error) {
        console.error(error);
      }
      res.send(post);
    }
  );
});
app.put("/update_to/:id", (req, res) => {
  Turnout.findById(req.body._id, function (error, turnout) {
    if (error) {
      console.error(error);
    }
    turnout._id = req.body._id;
    turnout.toID = req.body.toID;
    turnout.toNum = req.body.toNum;
    turnout.controller = req.body.controller;
    turnout.state = req.body.state;
    turnout.type = req.body.type;
    turnout.lock = req.body.lock;
    turnout.notes = req.body.notes;
    turnout.lastUpdate = req.body.lastUpdate;
    turnout.save(function (error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true,
      });
    });
  });
});
app.delete("/to/:id", (req, res) => {
  Turnout.deleteOne(
    {
      _id: req.params.id,
    },
    function (err, post) {
      if (err) res.send(err);
      res.send({
        success: true,
      });
    }
  );
});

// The following CRUD functions handle data in the micros collection
app.get("/microlist", async (req, res) => {
  const micros = await Micro.find().sort({
    _id: -1,
  });
  res.send(micros);
});
app.get("/micro/:id", async (req, res) => {
  const micro = Micro.findById(req.params.id)
    res.send(micro);
});
app.get("/micro_name/:id", async (req, res) => {
  const micro = Micro.findOne({ microID: req.params.id })
    res.send(micro);
});
app.get("/micro_id/:id", async (req, res) => {
  const micro = await Micro.findOne({
    microID: req.params.id,
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
app.get("/tpl_id/:id", (req, res) => {
  TPLight.findById(req.params.id, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post);
  });
});
app.get("/tpl_num/:id", (req, res) => {
  TPLight.findOne(
    {
      tplNum: req.params.id,
    },
    "_id",
    function (error, post) {
      if (error) {
        console.error(error);
      }
      res.send(post);
    }
  );
});
app.post("/add_tpl", async (req, res) => {
  await TPLight.create(req.body);
  res.send({
    success: true,
  });
});
app.put("/update_tpl/:id", (req, res) => {
  TPLight.findById(req.body._id, function (error, tpl) {
    if (error) {
      console.error(error);
    }
    tpl.to_id = req.body.to_id;
    tpl.tplNum = req.body.tplNum;
    tpl.controller = req.body.controller;
    tpl.panelName = req.body.panelName;
    tpl.panelNum = req.body.panelNum;
    tpl.lightNum = req.body.lightNum;
    tpl.save(function (error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true,
      });
    });
  });
});
app.delete("/tpl/:id", (req, res) => {
  TPLight.deleteOne(
    {
      _id: req.params.id,
    },
    function (err, post) {
      if (err) res.send(err);
      res.send({
        success: true,
      });
    }
  );
});

app.listen(process.env.PORT || 3006);
