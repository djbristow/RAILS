const Stream = require("stream");
const path = require("path");
const db = require("dropbox-stream");

module.exports = function(uploadInfo, req) {
	let save_path = path.join(uploadInfo.directory, uploadInfo.filename);
	save_path[0] != "/" ? save_path = "/" + save_path : ""; // dropbox requires absolute path

	const pass = new Stream.PassThrough();

	pass.on("error", (err) => req.efp.handleError(err));

	let up = db.createDropboxUploadStream({
		token: this.apiObject.accessToken,
		filepath: save_path
	})
	.on("done", (response) => {
		req.files[uploadInfo.fieldname] = response;
		req.efp.finished();
	})
	.on("progress", () => {})
	.on("error", (err) => {
		req.efp.handleError(new Error(err.error));
	});

	pass.pipe(up);

	return Promise.resolve(pass);
};
