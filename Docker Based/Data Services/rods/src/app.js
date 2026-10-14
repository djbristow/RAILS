// This express app prodes an API for Vue applications to get and put data
// to the MongoDB
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(cors({
    origin: [
    "http://localhost",         // For Nginx proxy in production
    "http://127.0.0.1",         // For Nginx proxy in production
    "http://localhost:3020",    // For Vite mrom dev server
    "http://127.0.0.1:3020",    // For Vite mrom dev server
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const mongodb_conn_module = require("./mongodbConnModule");
var db = mongodb_conn_module.connect();

var Consist = require("../models/Consist");

// The following CRUD functions handle data in the consists collection
app.get("/consistlist", async (req, res) => {
  const consists = await Consist.find().sort({
    consists: 1,
  });
  res.send(consists);
});

app.get("/consist/:id", async (req, res) => {
  const consist = await Consist.findById(req.params.id)
  .populate('cars.rollingStockId')
  .exec();
  res.send(consist);
});

app.post("/add_consist", async (req, res) => {
  const consist = await Consist.create(req.body);
  res.status(201).json(consist);
});

app.post("/consist/:id/cars/:position", async (req, res) => {
  const position = Number(req.params.position);
  if (!Number.isInteger(position) || position < 0) {
    return res.status(400).json({ error: "Position must be a non-negative integer" });
  }

  const consist = await Consist.findById(req.params.id);
  if (!consist) {
    return res.status(404).json({ error: "Consist not found" });
  }

  if (position > consist.cars.length) {
    return res.status(400).json({ error: "Position must be within the consist's car list" });
  }

  consist.cars.splice(position, 0, req.body);
  await consist.save();
  res.status(200).json(consist);
});

app.delete("/consist/:id/cars/:rollingStockId", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.rollingStockId)) {
    return res.status(400).json({ error: "Invalid rollingStockId" });
  }

  const consist = await Consist.findById(req.params.id);
  if (!consist) {
    return res.status(404).json({ error: "Consist not found" });
  }

  const carIndex = consist.cars.findIndex(
    (car) => car.rollingStockId.toString() === req.params.rollingStockId
  );
  if (carIndex === -1) {
    return res.status(404).json({ error: "Car not found in consist" });
  }

  consist.cars.splice(carIndex, 1);
  await consist.save();
  res.json(consist);
});

app.put("/consist/:id", async (req, res) => {
  const consist = await Consist.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!consist) {
    return res.status(404).json({ error: "Consist not found" });
  }

  res.json(consist);
});

app.delete("/consist/:id", async (req, res) => {
  const consist = await Consist.findByIdAndDelete(req.params.id);

  if (!consist) {
    return res.status(404).json({ error: "Consist not found" });
  }

  res.sendStatus(204);
});

app.listen(process.env.PORT || 3040);
