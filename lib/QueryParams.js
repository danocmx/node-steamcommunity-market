/**
 * Handles parameters.
 * @class
 */
class QueryParams {
	/**
	 * @constructor
	 * @param {object} defaults default parameters to the method
	 * @param {Options} options class options
	 * @param {boolean} useLocalizationParams if we use localization parameters
	 */
	constructor({ methodOptions, globalOptions, paramsHandler, useLocalizationParams = false }) {
		this.methodOptions = methodOptions;
		this.globalOptions = globalOptions;

		this.handler = paramsHandler;

		this.useLocalizationParams = useLocalizationParams;
	}

	get localization() { return this.globalOptions.localization; }

	get(params) {
		let methodParams = {};

		Object.assign(methodParams, this.methodOptions, params);

		if (this.useLocalizationParams) Object.assign(methodParams, this.localization);

		/**
		 * Function from method class used to modify params.
		 */
		if (this.handler) methodParams = this.handler(methodParams);

		return methodParams;
	}

	setHandler(handler) {
		this.handler = handler;
	}
}


module.exports = QueryParams;
