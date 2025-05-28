// MRFM Model Railroad File Manager
// This is a Hapi application that stores files on the server (POST). The images stored on
// the server are also available for reterival (GET).

import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = "3030" || process.env.PORT;
const uri1 = process.env.MYMRIM_URI1;
const uri2 = process.env.MYMRIM_URI2;

const allowedOrigins = [uri1, uri2];
console.log("Allowed origins: ", allowedOrigins);
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
};
app.use(cors(corsOptions));

app.use(express.static("src/uploads"));

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect file");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({
  dest: "./src/tmp",
  fileFilter,
  limits: {
    fileSize: 1000000,
  },
});

app.get("/", function (req, res) {
  res.sendFile("index.html");
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    let fileName = req.file.originalname;
    let filePath = req.file.path;
    let newPath = filePath.slice(filePath.indexOf("tmp") - 1, filePath.length);
    console.log(
      "File name: ",
      fileName + " File path: ",
      filePath + " New path: ",
      newPath
    );
    console.log(__dirname);
    fs.copyFile(
      __dirname + newPath,
      __dirname + "/uploads/" + fileName,
      function (err) {
        if (err) {
          throw err;
        } else {
          console.log("File Renamed.");
        }
      }
    );
    res.json({ file: req.file });
  } catch (err) {
    console.log("Error uploading file:", err);
    res.status(500).send("Error uploading file.");
  }
});

app.use((err, req, res) => {
  if (err.code === "INCORRECT_FILETYPE") {
    res.status(422).json({ error: "Only images are allowed" });
    return;
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(422).json({ error: "Allowed file size is 1000KB" });
    return;
  }
});

app.listen(PORT, () => console.log(`Server v2.4.4 listening on port ${PORT}`));
