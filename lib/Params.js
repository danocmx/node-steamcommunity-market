/**
 * Handles parameters.
 * @class
 */
class Params {
	/**
	 * @constructor
	 * @param {object} defaults
	 * @param {object} localization localization parameters
	 */
	constructor(defaults, options, useLocalizationParams) {
		this.defaults = defaults;
		this.options = options;

		this.useLocalizationParams = false;
	}

	get localization() { return this.options.localization; }

	get(params) {
		let methodParams = {};

		Object.assign(methodParams, this.defaults, params);

		if (this.useLocalizationParams) Object.assign(methodParams, this.localization);
		if (this.handler) methodParams = this.handler(methodParams);

		return methodParams;
	}

	setHandler(handler) {
		this.handler = handler;
	}
}


module.exports = Params;
