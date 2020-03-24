module.exports = function(array) {
	const jar = {};

	array.forEach((cookie) => {
		const [name, value] = cookie.split('=');
		jar[name] = value;
	});

	return jar;
};
