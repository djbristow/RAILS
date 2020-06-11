// This express app prodes an API for Vue applications to get and put data
// to the MongoDB
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

var Turnout = require("../models/Turnout");
var Micro = require("../models/Micro");

// The following CRUD functions handle data in the turnouts collection
app.get('/tolist', (req, res) => {
  Turnout.find({}, function (error, turnouts) {
    if (error) {
      console.error(error);
    }
    res.send({
      turnouts: turnouts
    })
  }).sort({
    'controller': 1,
    'toNum': 1
  })
})

app.post('/add_to', (req, res) => {
  var toID = req.body.toID;
  var toNum = req.body.toNum;
  var controller = req.body.controller
  var state = req.body.state;
  var type = req.body.type;
  var lock = req.body.lock;
  var notes = req.body.notes;
  var lastUpdate = req.body.lastUpdate;
  var new_Turnout = new Turnout({
    toID: toID,
    toNum: toNum,
    controller: controller,
    state: state,
    type: type,
    lock: lock,
    notes: notes,
    lastUpdate: lastUpdate
  })
  new_Turnout.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true
    })
  })
})
app.get('/to_id/:id', (req, res) => {
  Turnout.findById(req.params.id, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})
app.get('/to/:id', (req, res) => {
  Turnout.findOne({
    toID: req.params.id
  }, '_id', function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})
app.get('/to_ident/:id', (req, res) => {
  let to = req.params.id.split("-");
  Turnout.findOne({
    controller: to[0],
    toNum: to[1]
  }, function (error, post) {
    if (error) {
      console.error(error);
    }
      res.send(post)
  })
})
app.put('/update_to/:id', (req, res) => {
console.log(req.params.id);
  Turnout.findById(req.params.id, function (error, turnout) {
    if (error) {
      console.error(error);
    }
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
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})
app.delete('/to/:id', (req, res) => {
  Turnout.deleteOne({
    _id: req.params.id
  }, function (err, post) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})

// The following CRUD functions handle data in the micros collection
app.get('/microlist', (req, res) => {
  Micro.find({}, function (error, micros) {
    if (error) {
      console.error(error);
    }
    res.send({
      micros: micros
    })
  }).sort({
    _id: -1
  })
})
app.get('/micro/:id', (req, res) => {
  Micro.findById(req.params.id, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})
app.get('/micro_id/:id', (req, res) => {
  Micro.findOne({
    microID: req.params.id
  }, '_id', function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})
app.put('/update_micro/:id', (req, res) => {
  Micro.findById(req.params.id, function (error, micro) {
    if (error) {
      console.error(error);
    }
    micro.microID = req.body.microID;
    micro.microIP = req.body.microIP;
    micro.et = req.body.et;
    micro.purpose = req.body.purpose;
    micro.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})
app.post('/add_micro', (req, res) => {
  var microID = req.body.microID;
  var microIP = req.body.microIP;
  var et = req.body.et;
  var purpose = req.body.purpose;
  var new_micro = new Micro({
    microID: microID,
    microIP: microIP,
    et: et,
    purpose: purpose
  })
  new_micro.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true
    })
  })
})
app.delete('/micro/:id', (req, res) => {
  Micro.deleteOne({
    _id: req.params.id
  }, function (err, post) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})

app.listen(process.env.PORT || 3006)
