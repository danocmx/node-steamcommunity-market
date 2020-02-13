class CMResponse {
	constructor(handler, params, raw) {
		this.handler = handler;

		this.params = params;
		this.raw = raw;

		this.date = Date.now();
	}
}


module.exports = CMResponse;
