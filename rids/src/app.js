const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//const morgan = require('morgan')

const app = express()
//app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

var AarCode = require("../models/AarCode");
var Image = require("../models/Image");
var Industry = require("../models/Industry");
var Rollingstock = require("../models/Rollingstock");

// The following CRUD functions handle data in the aarCodes collection
app.get('/aarlist', (req, res) => {
     AarCode.find({}, function(error, aarCodes) {
          if (error) {
               console.error(error);
          }
          res.send({
               aarCodes: aarCodes
          })
     }).sort({
          _id: -1
     })
})
app.post('/add_aar', (req, res) => {
     var db = req.db;
     var aarCode = req.body.aarCode;
     var description = req.body.description;
     var rollingstockType = req.body.rollingstockType;
     var new_AarCode = new AarCode({
          aarCode: aarCode,
          description: description,
          rollingstockType: rollingstockType
     })
     new_AarCode.save(function(error) {
          if (error) {
               console.log(error)
          }
          res.send({
               success: true
          })
     })
})
app.get('/aar/:id', (req, res) => {
     var db = req.db;
     AarCode.findById(req.params.id, function(error, post) {
          if (error) {
               console.error(error);
          }
          res.send(post)
     })
})
app.put('/aar/:id', (req, res) => {
     var db = req.db;
     AarCode.findById(req.params.id, function(error, aarCode) {
          if (error) {
               console.error(error);
          }
          aarCode.aarCode = req.body.aarCode;
          aarCode.rollingstockType = req.body.rollingstockType;
          aarCode.description = req.body.description;
          aarCode.save(function(error) {
               if (error) {
                    console.log(error)
               }
               res.send({
                    success: true
               })
          })
     })
})
app.delete('/aar/:id', (req, res) => {
     var db = req.db;
     AarCode.remove({
          _id: req.params.id
     }, function(err, post) {
          if (err)
               res.send(err)
          res.send({
               success: true
          })
     })
})

// The following CRUD functions handle data in the images collection
app.get('/imglist', (req, res) => {
     Image.find({}, function(error, images) {
          if (error) {
               console.error(error);
          }
          res.send({
               images: images
          })
     }).sort({
          _id: -1
     })
})
app.get('/img/:id', (req, res) => {
     var db = req.db;
     Image.findById(req.params.id, function(error, post) {
          if (error) {
               console.error(error);
          }
          res.send(post)
     })
})
app.put('/img/:id', (req, res) => {
	var db = req.db;
	Image.findById(req.params.id, function (error, img) {
	  if (error) { console.error(error); }
          img.title = req.body.title;
          img.fileName = req.body.fileName;
          img.notes = req.body.notes;
	  img.save(function (error) {
			if (error) {
				console.log(error)
			}
			res.send({
				success: true
			})
		})
	})
})
app.post('/add_img', (req, res) => {
     var db = req.db;
     var title = req.body.title;
     var fileName = req.body.fileName;
     var notes = req.body.notes;
     var new_img = new Image({
          title: title,
          fileName: fileName,
          notes: notes
     })
     new_img.save(function(error) {
          if (error) {
               console.log(error)
          }
          res.send({
               success: true
          })
     })
})
app.delete('/img/:id', (req, res) => {
     var db = req.db;
     Image.remove({
          _id: req.params.id
     }, function(err, post) {
          if (err)
               res.send(err)
          res.send({
               success: true
          })
     })
})

// The following CRUD functions handle data in the industries collection
app.get('/colist', (req, res) => {
     Industry.find({}, function(error, industries) {
          if (error) {
               console.error(error);
          }
          res.send({
               industries: industries
          })
     }).sort({
          _id: -1
     })
})
app.get('/co/:id', (req, res) => {
     var db = req.db;
     Industry.findById(req.params.id, function(error, post) {
          if (error) {
               console.error(error);
          }
          res.send(post)
     })
})
app.post('/add_co', (req, res) => {
     var db = req.db;
     var shortName = req.body.shortName;
     var longName = req.body.longName;
     var industryType = req.body.industryType;
     var industryLocation = req.body.industryLocation;
     var new_industry = new Industry({
          shortName: shortName,
          longName: longName,
          industryType: industryType,
          industryLocation: industryLocation
     })
     new_industry.save(function(error) {
          if (error) {
               console.log(error)
          }
          res.send({
               success: true
          })
     })
})
app.put('/co/:id', (req, res) => {
	var db = req.db;
	Industry.findById(req.params.id, function (error, industry) {
	  if (error) { console.error(error); }
          industry.shortName = req.body.shortName;
          industry.longName = req.body.longName;
          industry.industryType = req.body.industryType;
          industry.industryLocation = req.body.industryLocation;
	  industry.save(function (error) {
			if (error) {
				console.log(error)
			}
			res.send({
				success: true
			})
		})
	})
})
app.delete('/co/:id', (req, res) => {
	var db = req.db;
	Industry.remove({
		_id: req.params.id
	}, function(err, post){
		if (err)
			res.send(err)
		res.send({
			success: true
		})
	})
})

// The following CRUD functions handle data in the rollingstocks collection
app.get('/rslist', (req, res) => {
     Rollingstock.find({}, 'roadName roadNumber color aarCode description', function(error, rollingstocks) {
          if (error) {
               console.error(error);
          }
          res.send({
               rollingstocks: rollingstocks
          })
     }).sort({
          'roadName': 1,
          'roadNumber': 1
     })
})
app.get('/rslistall', (req, res) => {
     Rollingstock.find({},function(error, rollingstocks) {
          if (error) {
               console.error(error);
          }
          res.send({
               rollingstocks: rollingstocks
          })
     }).sort({
          'roadName': 1,
          'roadNumber': 1
     })
})
app.get('/rs/:id', (req, res) => {
     var db = req.db;
     Rollingstock.findById(req.params.id, function(error, post) {
          if (error) {
               console.error(error);
          }
          res.send(post)
     })
})
app.post('/add_rs', (req, res) => {
     var db = req.db;
     var roadName = req.body.roadName;
     var roadNumber = req.body.roadNumber;
     var color = req.body.color;
     var aarCode = req.body.aarCode;
     var description = req.body.description;
     var numberBlt = req.body.numberBlt;
     var inSvcDate = req.body.inSvcDate;
     var insideLength = req.body.insideLength;
     var insideHeight = req.body.insideHeight;
     var insideWidth = req.body.insideWidth;
     var capacity = req.body.capacity;
     var bldr = req.body.bldr;
     var bltDate = req.body.bltDate;
     var notes = req.body.notes;
     var ltWeight = req.body.ltWeight;
     var loadLimit = req.body.loadLimit;
     var lastMaintDate = req.body.lastMaintDate;
     var locationNow = req.body.locationNow;
     var homeLocation = req.body.homeLocation;
     var rsStatus = req.body.rsStatus;
     var imageID = req.body.imageID;
     var modelWeight = req.body.modelWeight;
     var modelLength = req.body.modelLength;
     var rfid = req.body.rfid;
     var new_rs = new Rollingstock({
          roadName: roadName,
          roadNumber: roadNumber,
          color: color,
          aarCode: aarCode,
          description: description,
          numberBlt: numberBlt,
          inSvcDate: inSvcDate,
          insideLength: insideLength,
          insideHeight: insideHeight,
          insideWidth: insideWidth,
          capacity: capacity,
          bldr: bldr,
          bltDate: bltDate,
          notes: notes,
          ltWeight: ltWeight,
          loadLimit: loadLimit,
          lastMaintDate: lastMaintDate,
          locationNow: locationNow,
          homeLocation: homeLocation,
          rsStatus: rsStatus,
          imageID: imageID,
          modelWeight: modelWeight,
          modelLength: modelLength,
          rfid: rfid
     })
     new_rs.save(function(error) {
          if (error) {
               console.log(error)
          }
          res.send({
               success: true
          })
     })
})
app.put('/rs/:id', (req, res) => {
	var db = req.db;
	Rollingstock.findById(req.params.id, function (error, rs) {
	  if (error) { console.error(error); }
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
          rs.lastMaintDate = req.body.lastMaintDate;
          rs.locationNow = req.body.locationNow;
          rs.homeLocation = req.body.homeLocation;
          rs.rsStatus = req.body.rsStatus;
          rs.imageID = req.body.imageID;
          rs.modelWeight = req.body.modelWeight;
          rs.modelLength = req.body.modelLength;
          rs.rfid = req.body.rfid
	  rs.save(function (error) {
			if (error) {
				console.log(error)
			}
			res.send({
				success: true
			})
		})
	})
})
app.get('/rs_rfid/:id', (req, res) => {
     var db = req.db;
     Rollingstock.findOne({
          rfid: req.params.id
     }, 'roadName roadNumber', function(error, post) {
          if (error) {
               console.error(error);
          }
          res.send(post)
     })
})
app.get('/rs_road/:id', (req, res) => {
     let rn = req.params.id.split("-");
     var db = req.db;
     Rollingstock.findOne({
	roadName: rn[0],
	roadNumber: rn[1] 
     }, '_id', function(error, post) {
	if (error) {
	     console.error(error);
          }
          res.send(post)
     })
})
app.delete('/rs/:id', (req, res) => {
	var db = req.db;
	Rollingstock.remove({
		_id: req.params.id
	}, function(err, post){
		if (err)
			res.send(err)
		res.send({
			success: true
		})
	})
})

app.listen(process.env.PORT || 3000)
