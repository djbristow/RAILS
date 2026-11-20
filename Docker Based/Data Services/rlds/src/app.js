// This express app provides an API for Vue applications to get and put data
// to the MongoDB
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(express.json({ limit: '50mb' })); // Increase JSON size limit for SVG uploads
app.use(cors({
  origin: [
    "http://localhost:3002",    // Your Vite rsrmdev server
    "http://127.0.0.1:3002",    // Alternate localhost IP for dev server
    "http://localhost:3004",    // Your Vite mrlm dev server
    "http://127.0.0.1:3004",    // Alternate localhost IP for dev server
    "http://localhost",         // For Nginx proxy in production
    "http://127.0.0.1",         // For Nginx proxy in production
    "http://localhost:3001",    // For Vite mrim dev server
    "http://127.0.0.1:3001",    // For Vite mrim dev server
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Setup multer for file uploads
const uploadsDir = process.env.UPLOADS_DIR || '/app/src/uploads/svg-layouts';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename and preserve .svg extension
    const name = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${name}.svg`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Only accept SVG files
    if (path.extname(file.originalname).toLowerCase() === '.svg') {
      cb(null, true);
    } else {
      cb(new Error('Only SVG files are allowed'), false);
    }
  }
});

const mongodb_conn_module = require("./mongodbConnModule");
var db = mongodb_conn_module.connect();

var Turnout = require("../models/Turnout");
var Micro = require("../models/Micro");
var TPLight = require("../models/TPLight");

// SVG Layout endpoints
app.post("/svg-layout", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded" });
    }
    res.send({
      success: true,
      filename: req.file.filename,
      message: `SVG layout '${req.file.filename}' uploaded successfully`
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/svg-layouts", async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir).filter(file => file.endsWith('.svg'));
    res.send({
      success: true,
      layouts: files
    });
  } catch (error) {
    console.error("Error reading SVG layouts:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/svg-layout/:filename", async (req, res) => {
  try {
    const filename = path.basename(req.params.filename); // Sanitize filename
    const filepath = path.join(uploadsDir, filename);
    
    // Security check: ensure the file is within the uploads directory
    if (!filepath.startsWith(uploadsDir)) {
      return res.status(403).send({ error: "Access denied" });
    }
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).send({ error: "SVG layout not found" });
    }
    
    res.set('Content-Type', 'image/svg+xml');
    res.sendFile(filepath);
  } catch (error) {
    console.error("Error reading SVG layout:", error);
    res.status(500).send({ error: error.message });
  }
});

app.delete("/svg-layout/:filename", async (req, res) => {
  try {
    const filename = path.basename(req.params.filename); // Sanitize filename
    const filepath = path.join(uploadsDir, filename);
    
    // Security check: ensure the file is within the uploads directory
    if (!filepath.startsWith(uploadsDir)) {
      return res.status(403).send({ error: "Access denied" });
    }
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).send({ error: "SVG layout not found" });
    }
    
    fs.unlinkSync(filepath);
    res.send({
      success: true,
      message: `SVG layout '${filename}' deleted successfully`
    });
  } catch (error) {
    console.error("Error deleting SVG layout:", error);
    res.status(500).send({ error: error.message });
  }
});

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
app.get("/tpllist/:id", async (req, res) => {
  let tpl = await TPLight.find({ controller: req.params.id });
  res.send(tpl);
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
