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

const allowedOrigins = [uri1, uri2, 'http://localhost:3001', 'http://127.0.0.1:3001'];
console.log("Allowed origins: ", allowedOrigins);
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    'X-Requested-With', // Common header for AJAX requests
    'Accept'
  ],
  maxAge: 3600
};
app.use(cors(corsOptions));

// Correctly define the upload directory path
const UPLOAD_DIR = path.join(__dirname, 'uploads');
console.log("Upload directory: ", UPLOAD_DIR);

app.use(express.static(UPLOAD_DIR));

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect file");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5000000,
  },
});

app.get("/", function (req, res) {
  res.sendFile("index.html");
});

app.post("/upload", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Multer error during upload:", err);
      if (err.code === "INCORRECT_FILETYPE" || err.code === "LIMIT_FILE_SIZE") {
        return res.status(422).json({ error: err.message });
      }
      return res.status(500).send("Error uploading file.");
    }

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
  
    try {
      const fileName = req.file.originalname;
      console.log(`File uploaded successfully: ${fileName}`);
      res.json({ message: "File uploaded successfully", file: req.file });
    } catch (innerErr) {
      console.error("Error processing uploaded file:", innerErr);
      res.status(500).send("Error processing file after upload.");
    }
  });
});

app.use((err, req, res, next) => {
  console.error("Express middleware error:", err);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  res.status(500).send("An unexpected error occurred.");
});


app.listen(PORT, () => console.log(`Server v2.5.0 listening on port ${PORT}`));