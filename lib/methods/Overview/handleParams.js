const renameProperties = require('../../../utils/renameProperties');


module.exports = function(methodParams) {
	return renameProperties(methodParams, {
		marketHashName: 'market_hash_name',
	});
};
