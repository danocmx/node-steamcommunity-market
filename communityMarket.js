const CMResponse = require('./lib/CMResponse');
const CommunityMarket = require('./lib/CommunityMarket');
const MarketMethod = require('./lib/MarketMethod');
const Options = require('./lib/Options');
const QueryParams = require('./lib/QueryParams');
const RecursiveMarketMethod = require('./lib/RecursiveMarketMethod');

const Histogram = require('./lib/methods/Histogram');
const CMHistogram = require('./lib/methods/Histogram/CMHistogram');

const History = require('./lib/methods/History');
const CMHistory = require('./lib/methods/History/CMHistory');

const Listings = require('./lib/methods/Listings');
const CMListing = require('./lib/methods/Listings/CMListing');
const CMListings = require('./lib/methods/Listings/CMListings');
const ListingsHandler = require('./lib/methods/Listings/ListingsHandler');

const Overview = require('./lib/methods/Overview');
const CMOverview = require('./lib/methods/Overview/CMOverview');

const Search = require('./lib/methods/Search');
const CMSearch = require('./lib/methods/Search/CMSearch');
const CMSearchItem = require('./lib/methods/Search/CMSearchItem');
const SearchHandler = require('./lib/methods/Search/SearchHandler');

const ECMCurrencyCodes = require('./resources/ECMCurrencyCodes');
const ECMCurrencyPrefixes = require('./resources/ECMCurrencyPrefixes');
const ECMCurrencySigns = require('./resources/ECMCurrencySigns');
const ECMCurrencySuffixes = require('./resources/ECMCurrencySuffixes');

const convertCurrencyCode = require('./lib/currencies/convertCurrencyCode');
const convertCurrencySign = require('./lib/currencies/convertCurrencySign');
const getNormalCurrencyFormat = require('./lib/currencies/getNormalCurrencyFormat');
const parseCurrencyText = require('./lib/currencies/parseCurrencyText');

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
	QueryParams,
	RecursiveMarketMethod,
};


module.exports = CommunityMarket;
