module.exports.create = (resolve, reject) => {
	return (validFlag) => {
		[true, undefined, null].includes(validFlag) ? resolve() : (
			reject(validFlag || new Error("Validation error by custom validateFile function"))
		);
	};
};