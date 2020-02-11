# V3
Only tries to fetch data from the servers.

# Docs
<a name="CommunityMarket"></a>

## CommunityMarket
Main production class.

**Kind**: global class

* [CommunityMarket](#CommunityMarket)
    * _instance_
        * [.getHistogram()](#CommunityMarket+getHistogram) ⇒ <code>Promise.&lt;CMHistogram&gt;</code>
        * [.getListings()](#CommunityMarket+getListings) ⇒ <code>Promise.&lt;CMListings&gt;</code>
        * [.getOverview()](#CommunityMarket+getOverview) ⇒ <code>Promise.&lt;CMOverview&gt;</code>
        * [.search(params)](#CommunityMarket+search) ⇒ <code>Promise.&lt;CMSearch&gt;</code>
        * [.getPriceHistory()](#CommunityMarket+getPriceHistory) ⇒ <code>Promise.&lt;CMHistory&gt;</code>

<a name="CommunityMarket+getHistogram"></a>

### communityMarket.getHistogram() ⇒ <code>Promise.&lt;CMHistogram&gt;</code>
Gets histogram parameters for CommunityMarket

**Kind**: instance method of [<code>CommunityMarket</code>](#CommunityMarket)
**See**: Params.prototype.getLocalization for localization parameters

| Param | Type | Description |
| --- | --- | --- |
| params.itemNameID | <code>string</code> | item hash name |
| params.twoFactor | <code>string</code> |  |

<a name="CommunityMarket+getListings"></a>

### communityMarket.getListings() ⇒ <code>Promise.&lt;CMListings&gt;</code>
Gets CommunityMarket item listings

**Kind**: instance method of [<code>CommunityMarket</code>](#CommunityMarket)
**See**: Params.prototype.getLocalization for localization parameters

| Param | Type | Description |
| --- | --- | --- |
| params.start | <code>number</code> |  |
| params.count | <code>number</code> \| <code>void</code> | if void fetches all listings, otherwise by number |
| params.query | <code>string</code> \| <code>void</code> |  |

<a name="CommunityMarket+getOverview"></a>

### communityMarket.getOverview() ⇒ <code>Promise.&lt;CMOverview&gt;</code>
Gets overview for CommunityMarket item

**Kind**: instance method of [<code>CommunityMarket</code>](#CommunityMarket)

| Param | Type | Description |
| --- | --- | --- |
| params.marketHashName | <code>string</code> | CommunityMarket item name |
| params.appid | <code>number</code> |  |
| params.currency | <code>number</code> | ECMCurrencyCodes |

<a name="CommunityMarket+search"></a>

### communityMarket.search(params) ⇒ <code>Promise.&lt;CMSearch&gt;</code>
Searches the CommunityMarket

**Kind**: instance method of [<code>CommunityMarket</code>](#CommunityMarket)

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | Can also include other appid specific parameters. |
| params.query | <code>string</code> |  |
| params.start | <code>number</code> |  |
| params.count | <code>number</code> |  |
| params.searchDescriptions | <code>boolean</code> | If we want to search descriptions of items |
| params.sortColumn | <code>string</code> | Which column get items sorted by |
| params.sortDir | <code>string</code> | Which direction |
| params.noRender | <code>number</code> | Get html, currently useless. |
| params.appid | <code>number</code> |  |

<a name="CommunityMarket+getPriceHistory"></a>

### communityMarket.getPriceHistory() ⇒ <code>Promise.&lt;CMHistory&gt;</code>
Gets sale history. Currently does not work.

**Kind**: instance method of [<code>CommunityMarket</code>](#CommunityMarket)
**See**: Params.prototype.getLocalization for localization parameters

| Param | Type |
| --- | --- |
| params.marketHashName | <code>string</code> |
| params.appid | <code>number</code> |
