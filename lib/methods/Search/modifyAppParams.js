const _ = require('lodash');


module.exports = function(params) {
	const methodParams = { ...params };

	_.forOwn(methodParams, (value, param) => {
		if (['query', 'appid', 'search_descriptions', 'start', 'count', 'sort_column', 'sort_dir', 'norender'].includes(param)) {
			return;
		}

		methodParams[`category_${methodParams.appid}_${param}[]`] = `tag_${value}`;
		delete methodParams[param];
	});

	return methodParams;
};
