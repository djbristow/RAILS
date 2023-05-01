// This express app prodes an API for Vue applications to get and put data
// to the MongoDB
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongodb_conn_module = require("./mongodbConnModule");
var db = mongodb_conn_module.connect();

var AarCode = require("../models/AarCode");
var Image = require("../models/Image");
var Industry = require("../models/Industry");
var Rollingstock = require("../models/Rollingstock");
var Structure = require("../models/Structure");
var Dcc = require("../models/Dcc");

// The following CRUD functions handle data in the aarCodes collection
app.get("/aarlist", async (req, res) => {
  const aarCodes = await AarCode.find().sort({
    aarCode: 1,
  });
  res.send(aarCodes);
});
app.get("/aar_code/:id", async (req, res) => {
  const aar = await AarCode.findOne({
    aarCode: req.params.id,
  });
  res.send(aar);
});
app.post("/add_aar", async (req, res) => {
  await AarCode.create({
    aarCode: req.body.aarCode,
    description: req.body.description,
    rollingstockType: req.body.rollingstockType,
  });
  res.send();
});
app.put("/update_aar/:id", async (req, res) => {
  const aarCode = await AarCode.findById(req.body._id);
  aarCode.aarCode = req.body.aarCode;
  aarCode.rollingstockType = req.body.rollingstockType;
  aarCode.description = req.body.description;
  await aarCode.save();
  res.send();
});
app.delete("/aar/:id", async (req, res) => {
  await AarCode.deleteOne({
    _id: req.params.id,
  });
  res.send();
});

// The following CRUD functions handle data in the DCC collection
app.get("/dcclistall", async (req, res) => {
  const dccs = await Dcc.find();
  res.send(dccs);
});
app.get("/dcc_addr/:id", async (req, res) => {
  const dcc = await Dcc.findOne({
    address: req.params.id,
  });
  res.send(dcc);
});
app.post("/add_dcc", async (req, res) => {
  await Dcc.create({
    locomotiveID: req.body.locomotiveID,
    mfg: req.body.mfg,
    family: req.body.family,
    model: req.body.model,
    address: req.body.address,
  });
  res.send();
});
app.put("/update_dcc/:id", async (req, res) => {
  const dcc = await Dcc.findById(req.body._id);
  dcc.locomotiveID = req.body.locomotiveID;
  dcc.mfg = req.body.mfg;
  dcc.family = req.body.family;
  dcc.model = req.body.model;
  dcc.address = req.body.address;
  await dcc.save();
  res.send();
});
app.delete("/dcc/:id", async (req, res) => {
  await Dcc.deleteOne({
    _id: req.params.id,
  });
  res.send();
});

// The following CRUD functions handle data in the structures collection
app.get("/structlistall", async (req, res) => {
  const structures = await Structure.find().sort({
    title: 1,
  });
  res.send(structures);
});
app.get("/struct_title/:id", async (req, res) => {
  const structure = await Structure.findOne({
    title: req.params.id,
  });
  res.send(structure);
});
app.post("/add_struct", async (req, res) => {
console.log(req.body)
  await Structure.create({
    title: req.body.title,
    structureUse: req.body.structureUse,
    description: req.body.description,
    owner: req.body.owner,
    location: req.body.location,
    construction: req.body.construction,
    builtDate: req.body.builtDate,
    size: req.body.size,
    image: req.body.image,
    isIndustrial: req.body.isIndustrial,
    type: req.body.type,
    rawMaterials: req.body.rawMaterials,
    rMCapacity: req.body.rMCapacity,
    conRate: req.body.conRate,
    priority: req.body.priority,
    aarCodeIn: req.body.aarCodeIn,
    product: req.body.product,
    productCap: req.body.productCap,
    prodRate: req.body.prodRate,
    aarCodeOut: req.body.aarCodeOut,
    unloadDuration: req.body.unloadDuration,
    loadDuration: req.body.loadDuration,
    sidingCap: req.body.sidingCap,
    notes: req.body.notes,
  });
  res.send();
});
app.put("/update_struct/:id", async (req, res) => {
  const structure = await Structure.findById(req.body._id);
  structure.title = req.body.title;
  structure.structureUse = req.body.structureUse;
  structure.description = req.body.description;
  structure.owner = req.body.owner;
  structure.location = req.body.location;
  structure.construction = req.body.construction;
  structure.builtDate = req.body.builtDate;
  structure.size = req.body.size;
  structure.image = req.body.image;
  structure.isIndustrial = req.body.isIndustrial;
  structure.type = req.body.type;
  structure.rawMaterials = req.body.rawMaterials;
  structure.rMCapacity = req.body.rMCapacity;
  structure.conRate = req.body.conRate;
  structure.priority = req.body.priority;
  structure.aarCodeIn = req.body.aarCodeIn;
  structure.product = req.body.product;
  structure.productCap = req.body.productCap;
  structure.prodRate = req.body.prodRate;
  structure.aarCodeOut = req.body.aarCodeOut;
  structure.unloadDuration = req.body.unloadDuration;
  structure.loadDuration = req.body.loadDuration;
  structure.sidingCap = req.body.sidingCap;
  structure.notes = req.body.notes;
  await structure.save();
  res.send();
});
app.delete("/struct/:id", async (req, res) => {
  await Structure.deleteOne({
    _id: req.params.id,
  });
  res.send();
});

// The following CRUD functions handle data in the images collection
app.get("/imglist", async (req, res) => {
  const images = await Image.find().sort({
    _id: -1,
  });
  res.send(images);
});
/* app.get("/img/:id", (req, res) => {
  Image.findById(req.params.id, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post);
  });
});*/
app.get("/img_file/:id", async (req, res) => {
  const img = await Image.findOne({
    fileName: req.params.id,
  });
  res.send(img);
});
app.post("/add_img", async (req, res) => {
  await Image.create({
    title: req.body.title,
    fileName: req.body.fileName,
    notes: req.body.notes,
    category: req.body.category,
  });
  res.send();
});
app.put("/update_img/:id", async (req, res) => {
  const img = await Image.findById(req.body._id);
  img.title = req.body.title;
  img.fileName = req.body.fileName;
  img.notes = req.body.notes;
  img.category = req.body.category;
  await img.save();
  res.send();
});
app.delete("/img/:id", async (req, res) => {
  await Image.deleteOne({
    _id: req.params.id,
  });
  res.send();
});

// The following CRUD functions handle data in the industries collection
app.get("/colist", async (req, res) => {
  const industries = await Industry.find().sort({
    shortName: 1,
  });
  res.send(industries);
});
/* app.get("/co/:id", (req, res) => {
  Industry.findById(req.params.id, function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post);
  });
}); */
app.get("/co_name/:id", async (req, res) => {
  const co = await Industry.findOne({
    shortName: req.params.id,
  });
  res.send(co);
});
app.post("/add_co", async (req, res) => {
  await Industry.create({
    shortName: req.body.shortName,
    longName: req.body.longName,
    industryType: req.body.industryType,
    industryLocation: req.body.industryLocation,
  });
  res.send();
});
app.put("/update_co/:id", async (req, res) => {
  const industry = await Industry.findById(req.body._id);
  industry.shortName = req.body.shortName;
  industry.longName = req.body.longName;
  industry.industryType = req.body.industryType;
  industry.industryLocation = req.body.industryLocation;
  await industry.save();
  res.send();
});
app.delete("/co/:id", async (req, res) => {
  await Industry.deleteOne({
    _id: req.params.id,
  });
  res.send();
});

// The following CRUD functions handle data in the rollingstocks collection
app.get("/rslistall", async (req, res) => {
  const rollingstocks = await Rollingstock.find().sort({
    roadName: 1,
    roadNumber: 1,
  });
  res.send(rollingstocks);
});
/* app.get("/rslist", (req, res) => {
  Rollingstock.find(
    {},
    "roadName roadNumber color aarCode description",
    function (error, rollingstocks) {
      if (error) {
        console.error(error);
      }
      res.send({
        rollingstocks: rollingstocks,
      });
    }
  ).sort({
    roadName: 1,
    roadNumber: 1,
  });
});
app.get("/rslistroadnames", (req, res) => {
  Rollingstock.distinct("roadName", function (error, roadnames) {
    if (error) {
      console.error(error);
    }
    roadnames.sort();
    res.send({
      roadnames: roadnames,
    });
  });
});
app.get("/rslistaarcodes", (req, res) => {
  Rollingstock.distinct("aarCode", function (error, aarcodes) {
    if (error) {
      console.error(error);
    }
    aarcodes.sort();
    res.send({
      aarcodes: aarcodes,
    });
  });
});
app.get("/rslistopstatuses", (req, res) => {
  Rollingstock.distinct("rsStatus", function (error, opstatuses) {
    if (error) {
      console.error(error);
    }
    opstatuses.sort();
    res.send({
      opstatuses: opstatuses,
    });
  });
});

app.get("/rslocomotives", (req, res) => {
  Rollingstock.find(
    { $or: [{ aarCode: "DE" }, { aarCode: "SE" }] },
    function (error, rollingstocks) {
      if (error) {
        console.error(error);
      }
      res.send({
        rollingstocks: rollingstocks,
      });
    }
  ).sort({
    roadName: 1,
    roadNumber: 1,
  });
}); */
app.get("/rs/:id", async (req, res) => {
  const rs = await Rollingstock.findById(req.params.id);
  res.send(rs);
});
app.get("/rs_rfid/:id", async (req, res) => {
  const rs = await Rollingstock.findOne(
    {
      rfid: req.params.id,
    })
      res.send(rs);
});
app.get("/rs_road/:id", async (req, res) => {
  let rn = req.params.id.split("-");
  const rs = await Rollingstock.findOne({
    roadName: rn[0],
    roadNumber: rn[1],
  });
  res.send(rs);
});
app.post("/add_rs", async (req, res) => {
  await Rollingstock.create({
    roadName: req.body.roadName,
    roadNumber: req.body.roadNumber,
    color: req.body.color,
    aarCode: req.body.aarCode,
    description: req.body.description,
    numberBlt: req.body.numberBlt,
    inSvcDate: req.body.inSvcDate,
    insideLength: req.body.insideLength,
    insideHeight: req.body.insideHeight,
    insideWidth: req.body.insideWidth,
    capacity: req.body.capacity,
    bldr: req.body.bldr,
    bltDate: req.body.bltDate,
    notes: req.body.notes,
    ltWeight: req.body.ltWeight,
    loadLimit: req.body.loadLimit,
    loadTypes: req.body.loadTypes,
    lastMaintDate: req.body.lastMaintDate,
    locationNow: req.body.locationNow,
    homeLocation: req.body.homeLocation,
    rsStatus: req.body.rsStatus,
    imageID: req.body.imageID,
    modelWeight: req.body.modelWeight,
    modelLength: req.body.modelLength,
    rfid: req.body.rfid,
  });
  res.send();
});
app.put("/rs/:id", async (req, res) => {
  const rs = await Rollingstock.findById(req.params.id);
  rs.roadName = req.body.roadName;
  rs.roadNumber = req.body.roadNumber;
  rs.color = req.body.color;
  rs.aarCode = req.body.aarCode;
  rs.description = req.body.description;
  rs.numberBlt = req.body.numberBlt;
  rs.inSvcDate = req.body.inSvcDate;
  rs.insideLength = req.body.insideLength;
  rs.insideHeight = req.body.insideHeight;
  rs.insideWidth = req.body.insideWidth;
  rs.capacity = req.body.capacity;
  rs.bldr = req.body.bldr;
  rs.bltDate = req.body.bltDate;
  rs.notes = req.body.notes;
  rs.ltWeight = req.body.ltWeight;
  rs.loadLimit = req.body.loadLimit;
  rs.loadTypes = req.body.loadTypes;
  rs.lastMaintDate = req.body.lastMaintDate;
  rs.locationNow = req.body.locationNow;
  rs.homeLocation = req.body.homeLocation;
  rs.rsStatus = req.body.rsStatus;
  rs.imageID = req.body.imageID;
  rs.modelWeight = req.body.modelWeight;
  rs.modelLength = req.body.modelLength;
  rs.rfid = req.body.rfid;
  await rs.save();
  res.send(rs);
});
app.delete("/rs/:id", async (req, res) => {
  await Rollingstock.deleteOne({
    _id: req.params.id,
  });
  res.send();
});

app.listen(process.env.PORT || 3000);
