// This express app prodes an API for Vue applications to get and put data
// to the MOngoDB
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

var Company = require("../models/Company");
var Project = require("../models/Project");
var Purchase = require("../models/Purchase");

// The following CRUD functions handle data in the companies collection
app.get('/mcolist', (req, res) => {
  Company.find({}, function (error, companies) {
    if (error) {
      console.error(error);
    }
    res.send({
      companies: companies
    })
  }).sort({
    _id: -1
  })
})
app.post('/add_mco', (req, res) => {
  new_Company = new Company({
    name: req.body.name,
    website: req.body.website,
    phone: req.body.phone,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    notes: req.body.notes
  })
  new_Company.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true
    })
  })
})
app.get('/mco/:id', (req, res) => {
  Company.findById(req.params.id, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})
app.get('/mco_name/:id', (req, res) => {
  Company.findOne({name: req.params.id }, '_id', function (error, post) {
    if (error) {
      console.error(error);
    }
    console.log(post)
    res.send(post)
  })
})
app.put('/mco/:id', (req, res) => {
  Company.findById(req.params.id, function (error, company) {
    if (error) {
      console.error(error);
    }
    company.name = req.body.name;
    company.website = req.body.website;
    company.phone = req.body.phone;
    company.street = req.body.street;
    company.city = req.body.city;
    company.state = req.body.state;
    company.zip = req.body.zip;
    company.country = req.body.country;
    company.notes = req.body.notes;
    company.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})
app.delete('/mco/:id', (req, res) => {
  Company.deleteOne({
    _id: req.params.id
  }, function (err, post) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})

// The following CRUD functions handle data in the projects collection
app.get('/projlist', (req, res) => {
  Project.find({}, function (error, projects) {
    if (error) {
      console.error(error);
    }
    res.send({
      projects: projects
    })
  }).sort({
    _id: -1
  })
})
app.get('/proj/:id', (req, res) => {
  Project.findById(req.params.id, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})
app.put('/proj/:id', (req, res) => {
  Project.findById(req.params.id, function (error, project) {
    if (error) { console.error(error); }
    project.title = req.body.title;
    project.type = req.body.type;
    project.description = req.body.description;
    project.startdate = req.body.startdate;
    project.enddate = req.body.enddate;
    project.notes = req.body.notes;
    project.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})
app.post('/add_proj', (req, res) => {
  var new_project = new Project({
    title: req.body.title,
    type: req.body.type,
    description: req.body.description,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    notes: req.body.notes
  })
  new_project.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true
    })
  })
})
app.delete('/proj/:id', (req, res) => {
  Project.deleteOne({
    _id: req.params.id
  }, function (err, post) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})

// The following CRUD functions handle data in the purchases collection
app.get('/purlist', (req, res) => {
  Purchase.find({}, function (error, purchases) {
    if (error) {
      console.error(error);
    }
    res.send({
      purchases: purchases
    })
  }).sort({
    _id: -1
  })
})
app.get('/pur/:id', (req, res) => {
  Purchase.findById(req.params.id, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})
app.post('/add_pur', (req, res) => {
  var date = req.body.date;
  var store = req.body.store;
  var item = req.body.item;
  var desciption = req.body.desciption;
  var manufacturer = req.body.manufacturer;
  var unitcost = req.body.unitcost;
  var qty = req.body.qty;
  var project = req.body.project;
  var notes = req.body.notes;
  var new_industry = new Purchase({
    date: date,
    store: store,
    item: item,
    desciption: desciption,
    manufacturer: manufacturer,
    unitcost: unitcost,
    qty: qty,
    project: project,
    notes: notes
  })
  new_industry.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true
    })
  })
})
app.put('/pur/:id', (req, res) => {
  var db = req.db;
  Purchase.findById(req.params.id, function (error, purchase) {
    if (error) { console.error(error); }
    purchase.date = req.body.date;
    purchase.store = req.body.store;
    purchase.item = req.body.item;
    purchase.desciption = req.body.desciption;
    purchase.manufacturer = req.body.manufacturer;
    purchase.unitcost = req.body.unitcost;
    purchase.qty = req.body.qty;
    purchase.project = req.body.project;
    purchase.notes = req.body.notes;
    purchase.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})
app.delete('/pur/:id', (req, res) => {
  var db = req.db;
  Purchase.deleteOne({
    _id: req.params.id
  }, function (err, post) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})

app.listen(process.env.PORT || 3007)
