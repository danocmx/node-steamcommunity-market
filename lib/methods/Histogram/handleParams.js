const renameProperties = require('../../../utils/renameProperties');


module.exports = function(methodParams) {
	return renameProperties(methodParams, {
		itemNameID: 'item_nameid',
		twoFactor: 'two_factor',
	});
};
