// This express app prodes an API for Vue applications to get and put data
// to the MOngoDB
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: [
    "http://localhost:3008",    // For Vite mppm dev server
    "http://127.0.0.1:3008",    // Alternate localhost IP for dev server
    "http://localhost",         // For Nginx proxy in production
    "http://127.0.0.1",         // For Nginx proxy in production
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const mongodb_conn_module = require("./mongodbConnModule");
var db = mongodb_conn_module.connect();

var MrCompany = require("../models/MrCompany");
var Project = require("../models/Project");
var Purchase = require("../models/Purchase");

// The following CRUD functions handle data in the companies collection
app.get("/mcolist", async (req, res) => {
  const mrcos = await MrCompany.find({}).sort({ name: 1 });
  res.send({ mrcos });
});
app.get("/mco_name/:id", async (req, res) => {
  const mrcompany = await MrCompany.findOne({ name: req.params.id });
  res.send(mrcompany);
});
app.post("/add_mco", async (req, res) => {
  await MrCompany.create({
    name: req.body.name,
    type: req.body.type,
    website: req.body.website,
    phone: req.body.phone,
    address: req.body.address,
    notes: req.body.notes,
  });
  res.send();
});
app.put("/update_mco/:id", async (req, res) => {
  const mrcompany = await MrCompany.findById(req.body._id);
  mrcompany.name = req.body.name;
  mrcompany.type = req.body.type;
  mrcompany.website = req.body.website;
  mrcompany.email = req.body.email;
  mrcompany.phone = req.body.phone;
  mrcompany.address = req.body.address;
  mrcompany.notes = req.body.notes;
  await mrcompany.save();
  res.send();
});
app.delete("/mco/:id", async (req, res) => {
  await MrCompany.deleteOne({
    _id: req.params.id,
  });
  res.send();
});

// The following CRUD functions handle data in the projects collection
app.get("/projlist", async (req, res) => {
  const projects = await Project.find({}).sort({
    startdate: 1,
  });
  res.send({ projects });
});
app.get("/proj_title/:id", async (req, res) => {
  const project = await Project.findOne({ title: req.params.id });
  res.send(project);
});
app.post("/add_proj", async (req, res) => {
  await Project.create({
    title: req.body.title,
    type: req.body.type,
    description: req.body.description,
    priority: req.body.priority,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    roadname: req.body.roadname,
    roadnumbers: req.body.roadnumbers,
    notes: req.body.notes,
  });
  res.send();
});
app.put("/update_proj/:id", async (req, res) => {
  const project = await Project.findById(req.body._id);
  project.title = req.body.title;
  project.type = req.body.type;
  project.description = req.body.description;
  project.priority = req.body.priority;
  project.startdate = req.body.startdate;
  project.enddate = req.body.enddate;
  project.roadname = req.body.roadname;
  project.roadnumbers = req.body.roadnumbers;
  project.notes = req.body.notes;
  await project.save();
  res.send();
});
app.delete("/proj/:id", async (req, res) => {
  await Project.deleteOne({
    _id: req.params.id,
  });
  res.send();
});

// The following CRUD functions handle data in the purchases collection
app.get("/purlist", async (req, res) => {
  const purchases = await Purchase.find({}).sort({
    num: 1,
  });
  res.send(purchases);
});
app.get("/pur_number/:id", async (req, res) => {
  const purchase = await Purchase.findOne({ num: req.params.id });
  res.send(purchase);
});
app.post("/add_pur", async (req, res) => {
  await Purchase.create({
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
  res.send();
});
app.put("/update_pur/:id", async (req, res) => {
  const purchase = await Purchase.findById(req.body._id);
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
  await purchase.save();
  res.send();
});
app.delete("/pur/:id", async (req, res) => {
  await Purchase.deleteOne({
    _id: req.params.id,
  });
  res.send();
});

app.listen(process.env.PORT || 3007);
