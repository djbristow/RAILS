const hasha = require("hasha");
const path = require("path");
const createUserCallback = require("./userCallback").create;

module.exports = function(busboy, req) {

	busboy.on("file", (fieldname, file, originalname, encoding, mimetype) => {
		// emit 'end' event on file skip attaching listeners
		if(originalname == "" || req.efp._data[fieldname] != undefined || req.efp._finished) return file.resume();
		req.efp._data[fieldname] = { size: 0 };

		// Busboy emits limit event before my file listeners can reach it
		file.on("limit", () => req.efp.handleError(this.opts.maxfileSize.msg || new Error("File limit reached on file")));

		let fileInfo = {
			originalname: originalname,
			fieldname: fieldname,
			mimetype: mimetype,
			encoding: encoding
		};

		new Promise((resolve, reject) => {
			let userCallback = createUserCallback(resolve, reject);
			let skip = () => reject();
			this.opts.validateFile(fileInfo, userCallback, skip);
		})
		.then(() => {
			// user may use filename function but incorrectly return nothing. no warning supplied. defaults to hash
			this.opts.filename(req, fileInfo).then((save_filename) => {
				if((typeof(save_filename) == "string" && save_filename.length == 0) || save_filename == "/") {
					save_filename = hasha(Date.now() + originalname);
				}

				// user input may include filename with trailing slash
				let save_directory = path.join(this.opts.directory, save_filename, "..");
				save_filename = path.basename(save_filename);

				let uploadInfo = {
					directory: save_directory,
					filename: save_filename,
					mimetype: mimetype,
					fieldname: fieldname,
					file: file,
					api: this.opts.api
				};

				// init duplex stream (read/writable) or concat-stream depending on store method
				this.storeMethod(uploadInfo, req)
				.then((file_contents) => {
					req.efp._data[fieldname].stream = file_contents;
					// do not end through pipe, since streams should only end through efp finished method
					file.pipe(file_contents, { end: false }); 
					file.on("data", (data) => {
						if(!req.efp._finished) req.efp._data[fieldname].size += data.length;
					});
					file.on("error", (err) => req.efp.handleError(err));
				})
				.catch((err) => {
					req.efp.handleError(err);
				});
			}).catch((err) => {
				req.efp.handleError(err); // triggers if an error is thrown within the filename function (Err caused by User)
			});
		})
		.catch((err) => {
			err ? req.efp.handleError(err) : req.efp.skip(fieldname, file);
		});
	});

	busboy.on("field", (fieldname, val, fieldnameTruncated, valTruncated) => {
		!valTruncated && !fieldnameTruncated ? req.body[fieldname] = val : null;
	});

	busboy.on("error", (err) => req.efp.handleError(err));
	busboy.on("partsLimit", () => req.efp.handleError("parts limit reached"));
	busboy.on("filesLimit", () => req.efp.handleError("files limit reached"));
	busboy.on("fieldsLimit", () => req.efp.handleError("fields limit reached"));

	
	busboy.on("finish", () => {
		if(req.efp._finished) return; // handleError was called
		req.efp.busboy._finished = true;

		new Promise((resolve, reject) => {
			let userCallback = createUserCallback(resolve, reject);
			let skip = reject;
			this.opts.validateBody(req.body, userCallback, skip);
		})
		.then(() => {
			if(Object.keys(req.efp._data).length == 0) return req.efp.finished();
			// check for min size
			for(let key in req.efp._data) {
				if(this.opts.minfileSize.size > req.efp._data[key].size) {
					let err_msg = "Uploaded file was smaller than minfileSize." + " the file was of size " + req.efp._data[key].size;
					return req.efp.handleError(this.opts.minfileSize.msg || new Error(err_msg));
				}
			}
			// save files after all validation
			for(let key in req.efp._data) {
				req.efp._data[key].stream.end();
			}
		})
		.catch((err) => {
			return req.efp.handleError(err);
		});
	});
};