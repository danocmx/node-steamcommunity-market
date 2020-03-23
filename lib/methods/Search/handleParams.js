const renameProperties = require('../../../utils/renameProperties');
const modifyAppParams = require('./modifyAppParams');


module.exports = function(params) {
	let methodParams = renameProperties(params, {
		searchDescriptions: 'search_descriptions',
		sortColumn: 'sort_column',
		sortDir: 'sort_dir',
		noRender: 'norender',
	});

	methodParams.search_descriptions = methodParams.search_descriptions ? 1 : 0;

	if (methodParams.appid) {
		methodParams = modifyAppParams(methodParams);
	}

	return methodParams;
};
