const Stream = require("stream");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");

module.exports = function(uploadInfo, req) {

	return new Promise((resolve, reject) => {
		checkDir(uploadInfo.directory)
		.then(() => {
			const pass = new Stream.PassThrough();
			let save_path = path.join(uploadInfo.directory, uploadInfo.filename);
			let writeStream = fs.createWriteStream(save_path);

			pass.on("error", (err) => req.efp.handleError(err));
			pass.pipe(writeStream);
			pass.once("destroy", () => writeStream.emit("destroy"));

			writeStream.on("error", (err) => req.efp.handleError(err));
			writeStream.once("finish", () => {
				if(req.efp._finished) return; // when stream is to end and the file was deleted
				req.files[uploadInfo.fieldname] = {
					path: save_path,
					filename: uploadInfo.filename,
					mimetype: uploadInfo.mimetype,
					encoding: uploadInfo.encoding,
					size: req.efp._data[uploadInfo.fieldname].size
				};
				req.efp.finished();
			});
			writeStream.once("destroy", () => {
				fs.stat(save_path, (err, stats) => {
					if(err || !stats.isFile()) return;
					fs.unlink(save_path, (err) => {
						if(err) req.efp.handleError(err);
					});
				});
				// use this as indicator of having deleted file in writeStream end event
				delete req.efp._data[uploadInfo.fieldname]; 
				pass.end();
			});
			resolve(pass);
		})
		.catch((err) => {
			reject(err);
		});
	});
};

const checkDir = function(dir) {
	return new Promise((resolve, reject) => {
		fs.stat(dir, (err, stats) => {
			if (err || !stats) {
				mkdirp(dir, (err) => {
					if (err) return reject(err);
					return resolve();
				});
			} else if (stats.isFile()) { 
				reject(new Error("this directory is a file")); 
			} else {
				resolve();
			}
		});
	});
};
