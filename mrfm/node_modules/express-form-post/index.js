"use strict";
const path = require("path");
const hasha = require("hasha");
const fileHandler = require("./lib/fileHandler");
const attachListeners = require("./lib/attachListeners");

const ExpressFormPost = function(user_options = {}) {
	if(!(this instanceof ExpressFormPost)) return new ExpressFormPost(user_options);

	["validateFile", "validateBody"].forEach((validateFunctionKey) => {
		/*
		 * validateBody validates the req.body before sending off files to the store
		 * The file buffers will be sent to the store after the request has been validated
		 * This means that file_contents.end() only triggers after the "end" event is emitted
		 */
		if(user_options[validateFunctionKey]) {
			if(typeof user_options[validateFunctionKey] !== "function") {
				let err_msg = "option '" + validateFunctionKey + "' must be a function.";
				throw new Error(err_msg); 
			}
		} else {
			user_options[validateFunctionKey] = (information, handlePromise) => handlePromise();
		}
	});

	// Available storage methods
	if(!["disk", "aws-s3", "dropbox"].includes(user_options.store)) {
		if(user_options.store == undefined) {
			user_options.store = "disk";
		} else {
			throw new Error("storage " + user_options.store + " is not supported by express-form-post.\n"
				+ "\tCurrently available: ['disk', 'aws-s3', 'dropbox']");
		}
	}

	// Setting default directory based on store
	user_options.directory == undefined ? user_options.store == "disk" ? (
		user_options.directory = path.join(module.parent.filename, "..")
	) : user_options.directory = "" : null;

	// filename options setup
	if(typeof user_options.filename == "function") {
		let customFileMethod = user_options.filename;
		user_options.filename = (req, fileInfo) => {
			return new Promise((resolve) => customFileMethod(req, fileInfo, resolve));
		};
	} else {
		switch(user_options.filename) {
		case undefined:
		case "": 
			user_options.filename = (originalname) => { return Promise.resolve(hasha(Date.now() + originalname)); };
			break;
		default:
			var user_input = user_options.filename; // Closures are awesome
			user_options.filename = (req, fileInfo) => {
				return new Promise((resolve) => user_input(req, fileInfo, resolve));
			};
		}
	}

	["minfileSize", "maxfileSize"].forEach((limitfileSizeKey) => {
		switch(typeof user_options[limitfileSizeKey]) {
			case "object":
				break;
			case "undefined":
			case "number":
				user_options[limitfileSizeKey] = {
					size: user_options[limitfileSizeKey] || (limitfileSizeKey === "minfileSize" ? 0 : undefined)
				};
				break;
			default: {
				throw new Error("option '" + limitfileSizeKey + "' must be either an object or a number");
				break;
			}
		}
	});

	this.opts = {
		store: user_options.store,
		directory: user_options.directory,
		filename: user_options.filename,
		maxfileSize: user_options.maxfileSize,
		minfileSize: user_options.minfileSize,
		validateFile: user_options.validateFile,
		validateBody: user_options.validateBody,
		api: user_options.api,
		promise: user_options.promise
	};

	this.storeMethod = require(path.join(__dirname, "lib/store", this.opts.store));
	let checkApi = () => {
		if(!this.opts.api) throw new Error("You must specify api information to use " + this.opts.store +  " storage");
	};

	// set up abi objects here so we won't have to recreate upon sending stream to store handler
	switch(this.opts.store){
	case "aws-s3":{
		let aws = require("aws-sdk");
		checkApi();
		aws.config.update({
			accessKeyId: this.opts.api.accessKeyId,
			secretAccessKey: this.opts.api.secretAccessKey,
		});
		this.apiObject = new aws.S3();
		break;
	}
	case "dropbox":{
		checkApi();
		this.apiObject = {
			accessToken: this.opts.api.accessToken,
			clientId: this.opts.api.clientId,
			selectUser: this.opts.api.selectUser,
		};
		break;
	}
	default:
		this.apiObject = {}; // apiObject does not init on disk
	}
};

ExpressFormPost.prototype._fileHandler = fileHandler;
ExpressFormPost.prototype._attachListeners = attachListeners;

ExpressFormPost.prototype.fields = function() {
	return require("./lib/fields").bind(this);
};

ExpressFormPost.prototype.middleware = function() {
	/*
	 * fileHandler will be called in app.use as (req, res, cb)
	 * binding this to the return value because when it is used in the express middleware _filehandler loses this context
	 * the value of _fileHandler the function is being used to call rather than the function itself
	 */
	return this._fileHandler.bind(this);
};

// Upload function to be used within routes. handleError set as callback as well and can be check with if (err)
ExpressFormPost.prototype.upload = function(req, res, cb = () => {}) {
	typeof cb == "function" ? null : cb = () => {}; // prevent user failure

	if(this.opts.promise === true) {
		return new Promise((resolve, reject) => {
			// promiseCallback rejects if called as req.efp.handleError(err) and resolves if called as req.efp.finished();
			let promiseCallback = (err) => {
				if(err) {
					return reject(err);
				} else {
					resolve();
				}
			};
			this._fileHandler(req, res, promiseCallback);
		});
	} else {
		// cb is cb in fileHandler param
		this._fileHandler(req, res, cb);
	}
};


module.exports = ExpressFormPost;
