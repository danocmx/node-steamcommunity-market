/**
 * Handles parameters.
 * @class
 */
class ParamsHandler {
	/**
	 * @constructor
	 * @param {object} defaults
	 * @param {object} localization localization parameters
	 */
	constructor(defaults, localization) {
		this.defaults = defaults;
		this.localization = localization;
	}

	get(params) {
		const methodParams = {};

		Object.assign(methodParams, this.defaults, params);

		if (this.localization) Object.assign(methodParams, this.localization);
		if (this.handler) this.handler(methodParams);

		return methodParams;
	}

	setHandler(handler) {
		this.handler = handler;
	}
}


module.exports = ParamsHandler;
