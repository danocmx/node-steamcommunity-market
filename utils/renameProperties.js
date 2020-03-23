const _ = require('lodash');


/**
 * @param {object} base	base object for modification
 * @param {object} renames Object of properties you want to rename
 */
module.exports = function(base, renames) {
	const clonedBase = { ...base };

	_.forOwn(renames, (newName, oldName) => {
		if (Object.prototype.hasOwnProperty.call(clonedBase, oldName)) {
			clonedBase[newName] = clonedBase[oldName];
			delete clonedBase[oldName];
		}
	});

	return clonedBase;
};
