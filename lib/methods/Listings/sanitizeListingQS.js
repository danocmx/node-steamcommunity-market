module.exports = function(qs) {
	const sanitizedQS = { ...qs };

	delete sanitizedQS.appid;
	delete sanitizedQS.marketHashName;

	return sanitizedQS;
};
