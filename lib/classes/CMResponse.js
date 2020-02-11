class CMResponse {
	constructor(communityMarket, params, data) {
		this.communityMarket = communityMarket;

		this.params = params;
		this.raw = data;

		this.date = Date.now();
	}
}

module.exports = CMResponse;
