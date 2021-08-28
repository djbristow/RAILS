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
var Rollingstock = require("../models/Rollingstock")

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
    type: req.body.type,
    website: req.body.website,
    phone: req.body.phone,
    address: req.body.address,
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
    company.type = req.body.type;
    company.website = req.body.website;
    company.phone = req.body.phone;
    company.address = req.body.address;
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
app.get('/projectlisttype', (req, res) => {
  Project.distinct('type', function (error, projects) {
    if (error) {
      console.error(error);
    }
    projects.sort();
    res.send({
      projects: projects
    })
  })
})
app.get('/projlist', (req, res) => {
  Project.find({}, function (error, projects) {
    if (error) {
      console.error(error);
    }
    res.send({
      projects: projects
    })
  }).sort({
    startdate: 1
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
    project.roadname = req.body.roadname;
    project.roadnumbers = req.body.roadnumbers;
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
    roadname: req.body.roadname,
    roadnumbers: req.body.roadnumbers,
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
app.get('/purlistmanufacturer', (req, res) => {
  Purchase.distinct('manufacturer', function (error, purchases) {
    if (error) {
      console.error(error);
    }
    purchases.sort();
    res.send({
      purchases: purchases
    })
  })
})
app.get('/purliststore', (req, res) => {
  Purchase.distinct('store', function (error, purchases) {
    if (error) {
      console.error(error);
    }
    purchases.sort();
    res.send({
      purchases: purchases
    })
  })
})
app.get('/purlistproject', (req, res) => {
  Purchase.distinct('project', function (error, purchases) {
    if (error) {
      console.error(error);
    }
    purchases.sort();
    res.send({
      purchases: purchases
    })
  })
})
app.get('/purlist', (req, res) => {
  Purchase.find({}, function (error, purchases) {
    if (error) {
      console.error(error);
    }
    res.send({
      purchases: purchases
    })
  }).sort({
    num: 1
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
  var new_purchase = new Purchase({
    num: req.body.num,
    date: req.body.date,
    store: req.body.store,
    item: req.body.item,
    desciption: req.body.desciption,
    manufacturer: req.body.manufacturer,
    unitcost: req.body.unitcost,
    qty: req.body.qty,
    project: req.body.project,
    roadname: req.body.roadname,
    roadnumbers: req.body.roadnumbers,
    notes: req.body.notes
  })
  new_purchase.save(function (error) {
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
    purchase.num = req.body.num;
    purchase.date = req.body.date;
    purchase.store = req.body.store;
    purchase.item = req.body.item;
    purchase.desciption = req.body.desciption;
    purchase.manufacturer = req.body.manufacturer;
    purchase.unitcost = req.body.unitcost;
    purchase.qty = req.body.qty;
    purchase.project = req.body.project;
    purchase.roadname = req.body.roadname;
    purchase.roadnumbers = req.body.roadnumbers;
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
app.get('/fetch_purchases/:id', (req, res) => {
  let proj = req.params.id
  Purchase.find({
    project: proj
  }, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})
app.get('/rs_road/:id', (req, res) => {
  let rn = req.params.id.split("-");
  Rollingstock.findOne({
    roadName: rn[0],
    roadNumber: rn[1]
  }, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})

app.listen(process.env.PORT || 3007)
