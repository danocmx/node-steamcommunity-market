module.exports = function isRequestSuccessful(success, json) {
	return json === true && !(success === true || success === 1);
};
