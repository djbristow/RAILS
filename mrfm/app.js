var express = require("express");
var app = express();
var efp = require("express-form-post");
const formPost = efp({
    store: "disk",
    directory: "./public",
    filename: function(req, file, cb) {
        cb(file.originalname);
    }
});

app.post("/uploadimg", formPost.middleware(), function(req, res, next) {
    res.send("Upload successful!");
});

app.listen(3003, function(a) {
     console.log("Listening on port 3003");
});
