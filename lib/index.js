const CommunityMarket = require('./CommunityMarket');
const Params = require('./lib/Params');

const CMHistogram = require('./lib/classes/CMHistogram');
const CMHistory = require('./lib/classes/CMHistory');
const CMListing = require('./lib/classes/CMListing');
const CMListings = require('./lib/classes/CMListings');
const CMOverview = require('./lib/classes/CMOverview');
const CMResponse = require('./lib/classes/CMResponse');
const CMSearch = require('./lib/classes/CMSearch');
const CMSearchListing = require('./lib/classes/CMSearchListing');

const ECMCurrencyCodes = require('./lib/resources/ECMCurrencyCodes');
const ECMCurrencyPrefixes = require('./lib/resources/ECMCurrencyPrefixes');
const ECMCurrencySigns = require('./lib/resources/ECMCurrencySigns');
const ECMCurrencySuffixes = require('./lib/resources/ECMCurrencySuffixes');

const convertCurrencyCode = require('./lib/utils/convertCurrencyCode');
const convertCurrencySign = require('./lib/utils/convertCurrencySign');
const getNormalCurrencyFormat = require('./lib/utils/getNormalCurrencyFormat');
const isRequestSuccessful = require('./lib/utils/isRequestSuccessful');
const parseCurrencyText = require('./lib/utils/parseCurrencyText');


CommunityMarket.classes = {
	CMHistogram,
	CMHistory,
	CMListing,
	CMListings,
	CMOverview,
	CMResponse,
	CMSearch,
	CMSearchListing,
};

CommunityMarket.enums = {
	ECMCurrencyCodes,
	ECMCurrencyPrefixes,
	ECMCurrencySigns,
	ECMCurrencySuffixes,
};

CommunityMarket.utils = {
	convertCurrencyCode,
	convertCurrencySign,
	getNormalCurrencyFormat,
	isRequestSuccessful,
	parseCurrencyText,
};

CommunityMarket.lib = {
	Params,
};


module.exports = CommunityMarket;
