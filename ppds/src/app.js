// This express app prodes an API for Vue applications to get and put data
// to the MOngoDB
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongodb_conn_module = require("./mongodbConnModule");
var db = mongodb_conn_module.connect();

var MrCompany = require("../models/MrCompany");
var Project = require("../models/Project");
var Purchase = require("../models/Purchase");

// The following CRUD functions handle data in the companies collection
app.get("/mcolist", (req, res) => {
  MrCompany.find({}, function (error, mrcompanies) {
    if (error) {
      console.error(error);
    }
    res.send({
      mrcompanies: mrcompanies,
    });
  }).sort({
    _id: -1,
  });
});
app.post("/add_mco", (req, res) => {
  var new_MrCompany = new MrCompany({
    name: req.body.name,
    type: req.body.type,
    website: req.body.website,
    phone: req.body.phone,
    address: req.body.address,
    notes: req.body.notes,
  });
  new_MrCompany.save(function (error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true,
    });
  });
});
app.get("/mco_name/:id", (req, res) => {
  MrCompany.findOne({ name: req.params.id }, "_id", function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post);
  });
});
app.put("/update_mco/:id", (req, res) => {
  MrCompany.findById(req.body._id, function (error, mrcompany) {
    if (error) {
      console.error(error);
    }
    mrcompany.name = req.body.name;
    mrcompany.type = req.body.type;
    mrcompany.website = req.body.website;
    mrcompany.email = req.body.email;
    mrcompany.phone = req.body.phone;
    mrcompany.address = req.body.address;
    mrcompany.notes = req.body.notes;
    mrcompany.save(function (error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true,
      });
    });
  });
});
app.delete("/mco/:id", (req, res) => {
  MrCompany.deleteOne(
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

// The following CRUD functions handle data in the projects collection
app.get("/projlist", (req, res) => {
  Project.find({}, function (error, projects) {
    if (error) {
      console.error(error);
    }
    res.send({
      projects: projects,
    });
  }).sort({
    startdate: 1,
  });
});
app.get("/proj_title/:id", (req, res) => {
  Project.findOne({title: req.params.id}, "_id", function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post);
  });
});
app.put("/update_proj/:id", (req, res) => {
  Project.findById(req.body._id, function (error, project) {
    if (error) {
      console.error(error);
    }
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
        console.log(error);
      }
      res.send({
        success: true,
      });
    });
  });
});
app.post("/add_proj", (req, res) => {
  var new_project = new Project({
    title: req.body.title,
    type: req.body.type,
    description: req.body.description,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    roadname: req.body.roadname,
    roadnumbers: req.body.roadnumbers,
    notes: req.body.notes,
  });
  new_project.save(function (error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true,
    });
  });
});
app.delete("/proj/:id", (req, res) => {
  Project.deleteOne(
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

// The following CRUD functions handle data in the purchases collection
app.get("/purlist", (req, res) => {
  Purchase.find({}, function (error, purchases) {
    if (error) {
      console.error(error);
    }
    res.send({
      purchases: purchases,
    });
  }).sort({
    num: 1,
  });
});
app.get("/pur_number/:id", (req, res) => {
  Purchase.findOne({num: req.params.id}, "_id", function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post);
  });
});
app.post("/add_pur", (req, res) => {
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
    notes: req.body.notes,
  });
  new_purchase.save(function (error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true,
    });
  });
});
app.put("/update_pur/:id", (req, res) => {
  Purchase.findById(req.body._id, function (error, purchase) {
    if (error) {
      console.error(error);
    }
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
        console.log(error);
      }
      res.send({
        success: true,
      });
    });
  });
});
app.delete("/pur/:id", (req, res) => {
  var db = req.db;
  Purchase.deleteOne(
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


app.listen(process.env.PORT || 3007);
