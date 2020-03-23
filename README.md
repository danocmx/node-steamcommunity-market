# steamcommunity-market
Handy library that requests data from steamcommunity market API.

# Instalation
It's simple, just type in:
```
npm install steamcommunity-market
```

For more stable version:
```
npm install steamcommunity-market@3.0.3
```

# Docs
<a name="CommunityMarket"></a>

## CommunityMarket
Main production class.


* [CommunityMarket](#CommunityMarket)

    * [new CommunityMarket([options])](#new_CommunityMarket_new)      

    * _instance_
        * [.getHistogram()](#CommunityMarket+getHistogram)

        * [.getListings()](#CommunityMarket+getListings)

        * [.getOverview()](#CommunityMarket+getOverview)

        * [.search([params])](#CommunityMarket+search)

        * [.getPriceHistory()](#CommunityMarket+getPriceHistory)      


<a name="new_CommunityMarket_new"></a>

### new CommunityMarket([options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  |  |
| [options.http] | <code>object</code> |  | HTTP setting default, look at request docs. |
| [options.localization] | <code>object</code> |  | Default localization settings. |
| [options.localization.currency] | <code>ECMCurrencyCodes</code> | <code>1</code> |  |
| [options.localization.country] | <code>string</code> | <code>&quot;&#x27;us&#x27;&quot;</code> | Country name shortened. |
| [options.localization.language] | <code>string</code> | <code>&quot;&#x27;en&#x27;&quot;</code> | Language name shortened. |
| [options.histogram] | <code>object</code> |  | Histogram default settings. |
| [options.listings] | <code>object</code> |  | Listing default settings. |
| [options.search] | <code>object</code> |  | Search default settings. |

<a name="CommunityMarket+getHistogram"></a>

### *communityMarket*.getHistogram()
**See**: Params.prototype.getLocalization For localization parameters.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params.itemNameID | <code>string</code> |  | Item market hash name. |
| [params.twoFactor] | <code>string</code> | <code>0</code> | Unknown setting. |

Gets histogram parameters for CommunityMarket.

<a name="CommunityMarket+getListings"></a>

### *communityMarket*.getListings()
**See**: Params.prototype.getLocalization For localization parameters.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [params.start] | <code>number</code> | <code>0</code> | Starting point. |
| [params.count] | <code>number</code> \| <code>void</code> |  | If void fetches all listings, otherwise by number. |
| [params.query] | <code>string</code> \| <code>void</code> |  | Description query search. |

Gets CommunityMarket item listings.

<a name="CommunityMarket+getOverview"></a>

### *communityMarket*.getOverview()

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params.marketHashName | <code>string</code> |  | Steam name that is included in the url. |
| params.appid | <code>number</code> |  | Game ID on steam. |
| [params.currency] | <code>ECMCurrencyCodes</code> | <code>1</code> |  |

Gets overview for CommunityMarket item.

<a name="CommunityMarket+search"></a>

### *communityMarket*.search([params])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [params] | <code>object</code> | <code>{}</code> | Can also include other appid specific parameters. |
| [params.query] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> |  |
| [params.start] | <code>number</code> | <code>0</code> | Search start. |
| [params.count] | <code>number</code> |  | How many do we want, if void searches for all. |
| [params.searchDescriptions] | <code>boolean</code> | <code>false</code> | If we want to search descriptions of items. |
| [params.sortColumn] | <code>string</code> | <code>&quot;&#x27;price&#x27;&quot;</code> | Which column get items sorted by. |
| [params.sortDir] | <code>string</code> | <code>&quot;&#x27;asc&#x27;&quot;</code> | Which direction. |
| [params.appid] | <code>number</code> |  | Game ID on steam. |

Searches the CommunityMarket.

<a name="CommunityMarket+getPriceHistory"></a>

### *communityMarket*.getPriceHistory()
**See**: Params.prototype.getLocalization For localization parameters.

| Param | Type | Description |
| --- | --- | --- |
| params.marketHashName | <code>string</code> | Steam name that is included in the url. |
| params.appid | <code>number</code> | Game ID on steam. |

Gets sale history. Currently does not work.
