const Busboy = require("busboy");

module.exports = function(req, res, cb) {
	if(req.method == "POST") {
		if(req._body) return cb();
		/*
		 * _finished is false by default and set to true if efp has "finished". Usually this just means that
		 * the next middleware has been called already and further calls to finished and handleError does nothing
		 * efp.busboy._finished is false by default and true if busboy is done parsing
		 * _data tracks each inidividual's file size and stream 
		 */
		req.efp = { _finished: false, _data: {}, busboy: { _finished: false }};
		req.body = {};
		req._body = true; // prevent multiple multipart middleware and body-parser from colliding
		req.files = {};
		
		/* 
		 * In middleware, req.efp.finished passes on to next middleware
		 * Validation checking in req.efp.finished because of upload function cb not next param in middleware
		 * In upload function, req.efp.finished will be the callback with an err parameter. (err be undefined)
		 * req.efp.finished will be called when finished with parsing the request to pass on to the cb action
		 * buffers array holds file contents that should be sent to the store if the body is valid
		 */
		req.efp.finished = function() {
			if(req.efp._finished) return;
			if(Object.keys(req.files).length == Object.keys(req.efp._data).length && req.efp.busboy._finished) {
				// all files that were sent to the store have been uploaded and busboy is done parsing
				req.efp._finished = true;
				return cb();
			}
		};

		// make sure this is called before handleError call
		req.efp._removeAllUploads = function() {
			req.body = {};
			for(let key in req.efp._data) {
				req.efp._data[key].stream ? req.efp._data[key].stream.emit("destroy") : delete req.efp._data[key];
			}
		};

		/*
		 * A call to req.efp.handleError will nullify any subsequent calls to req.efp.finished and req.efp.handleError
		 */

		req.efp.handleError = (err) => {
			if(req.efp._finished) return;
			req.efp._finished = true;
			req.unpipe(busboy);
			busboy.removeAllListeners();
			req.on("readable", () => req.read());
			req.efp._removeAllUploads();
			cb(err);
		};

		req.efp.skip = (fieldname, file) => {
			delete req.efp._data[fieldname];
			return file.resume();
		}

		try {
			var busboy = new Busboy({ 
				headers: req.headers,
				limits: {
					fileSize: this.opts.maxfileSize.size
				}
			});
			this._attachListeners(busboy, req);
			req.pipe(busboy);
		} catch(err) {
			req.efp.handleError(err);
		}
	} else {
		return cb();
	}
};