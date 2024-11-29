// MRFM Model Railroad File Manager
// This is a Hapi application that stores files on the server (POST). The images stored on
// the server are also available for reterival (GET).

import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const uri = process.env.MYMRIM_URI;
const corsOptions = {
  origin: 'http://' + uri,
};
const app = express();
app.use(express.static("src/uploads"));
app.use(cors(corsOptions));

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

const PORT = "3030" || process.env.PORT;

app.get("/", function (req, res) {
  res.sendFile('index.html');
});

app.post("/upload", upload.single("file"), (req, res) => {
  let fileName = req.file.originalname;
  let filePath = req.file.path;
  let newPath = filePath.slice(filePath.indexOf("tmp") - 1, filePath.length);
  console.log("File name: ", fileName + " File path: ", filePath + " New path: ", newPath);
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

app.listen(PORT, () => console.log(`Server v2.3.1 listening on port ${PORT}`));
