const CMResponse = require('./CMResponse');
const CommunityMarket = require('./CommunityMarket');
const MarketMethod = require('./MarketMethod');
const Options = require('./Options');
const Params = require('./Params');
const RecursiveMarketMethod = require('./RecursiveMarketMethod');

const Histogram = require('./Histogram');
const CMHistogram = require('./Histogram/CMHistogram');

const History = require('./History');
const CMHistory = require('./History/CMHistory');

const Listings = require('./Listings');
const CMListing = require('./Listings/CMListing');
const CMListings = require('./Listings/CMListings');
const ListingsHandler = require('./Listings/ListingsHandler');

const Overview = require('./Overview');
const CMOverview = require('./Overview/CMOverview');

const Search = require('./Search');
const CMSearch = require('./Search/CMSearch');
const CMSearchItem = require('./Search/CMSearchItem');
const SearchHandler = require('./Search/SearchHandler');

const ECMCurrencyCodes = require('../resources/ECMCurrencyCodes');
const ECMCurrencyPrefixes = require('../resources/ECMCurrencyPrefixes');
const ECMCurrencySigns = require('../resources/ECMCurrencySigns');
const ECMCurrencySuffixes = require('../resources/ECMCurrencySuffixes');

const convertCurrencyCode = require('../utils/convertCurrencyCode');
const convertCurrencySign = require('../utils/convertCurrencySign');
const getNormalCurrencyFormat = require('../utils/getNormalCurrencyFormat');
const parseCurrencyText = require('../utils/parseCurrencyText');

CommunityMarket.Histogram = Histogram;
CommunityMarket.Histogram.CMHistogram = CMHistogram;

CommunityMarket.History = History;
CommunityMarket.History.CMHistory = CMHistory;

CommunityMarket.Listings = Listings;
CommunityMarket.Listings.CMListing = CMListing;
CommunityMarket.Listings.CMListings = CMListings;
CommunityMarket.Listings.ListingsHandler = ListingsHandler;

CommunityMarket.Overview = Overview;
CommunityMarket.Overview.CMOverview = CMOverview;

CommunityMarket.Search = Search;
CommunityMarket.Search.CMSearch = CMSearch;
CommunityMarket.Search.CMSearchItem = CMSearchItem;
CommunityMarket.Search.SearchHandler = SearchHandler;

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
	parseCurrencyText,
};

CommunityMarket.lib = {
	CMResponse,
	MarketMethod,
	Options,
	Params,
	RecursiveMarketMethod,
};


module.exports = CommunityMarket;
