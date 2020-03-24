const _ = require('lodash');

const CMListing = require('./CMListing');
const CMResponse = require('../../CMResponse');


class CMListings extends CMResponse {
	constructor(handler, params, data) {
		super(handler, params, data);

		this.getListings(data);

		this.totalCount = this.listings.length;
	}

	/**
	 * Allows you to iterate over
	 */
	[Symbol.iterator]() {
		return this.listings.values();
	}

	getListings({ listinginfo, assets }) {
		const listings = [];

		const self = this;
		_.forOwn(listinginfo, (info) => {
			listings.push(
				self.getCMListing(assets, info),
			);
		});

		this.listings = listings;
	}

	getCMListing(assets, info) {
		const { appid, contextid, id } = info.asset;

		const asset = assets[appid][contextid][id];

		return new CMListing(asset, info, this.date);
	}

	update(params) {
		const listingParams = {};

		Object.assign(listingParams, this.params, params);

		return this.handler
			.get(listingParams)
			.then((listings) => {
				this.updateFromObject(listings);
				this.params = listingParams;

				return this;
			});
	}

	updateFromObject({ listings, date }) {
		this.date = date;

		this.listings.length = 0;
		this.listings.push(...listings);
	}
}


module.exports = CMListings;
