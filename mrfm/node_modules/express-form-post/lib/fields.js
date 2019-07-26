const Busboy = require("busboy");

module.exports = function(req, res, next) {
	if(req.method == "POST" && !req.headers["content-type"].includes("multipart")) {
		if(req._body) return next();

		try {
			var busboy = new Busboy({ headers: req.headers });
		} catch(err) {
			return next(err);
		}

		req._body = true;
		req.body = {};

		busboy.on("file", (fieldname, file) => {
			file.on("data", () => {});
			file.on("limit", () => {});
			file.on("end", () => {});
		});

		busboy.on("field", (fieldname, val, fieldnameTruncated, valTruncated) => {
			req._body ? null : req._body = true; // flag to prevent other parsers from parsing req for body
			!valTruncated && !fieldnameTruncated ? req.body[fieldname] = val : null;
		});

		busboy.on("error", (err) => next(err));
		busboy.on("partsLimit", () => next(new Error("parts limit reached")));
		busboy.on("filesLimit", () => next(new Error("files limit reached")));
		busboy.on("fieldsLimit", () => next(new Error("fields limit reached")));

		busboy.on("finish", () => {
			return next();
		});

		req.pipe(busboy);
	} else {
		return next();
	}
};
