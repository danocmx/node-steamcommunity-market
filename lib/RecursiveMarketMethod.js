class RecursiveMarketMethod {
	static get MAX_PAGE_SIZE() { return 100; }

	constructor(qs, request) {
		this.qs = qs;
		this.request = request;

		this.currentCount = 0;
		this.totalCount = 0;
		this.desiredCount = 0;

		this.stopped = false;

		this.setDesiredCount()
			.setCount(this.qs.count);
	}

	setDesiredCount() {
		const { start = 0, count } = this.qs;

		if (count > RecursiveMarketMethod.MAX_PAGE_SIZE) this.desiredCount = parseInt(count) + start;
		else if (!count) this.desiredCount = Infinity;

		return this;
	}

	shouldFetchNextPage() {
		if (!this.desiredCount || this.stopped) {
			return false;
		}

		const celling = this.getCelling();

		return this.currentCount < celling;
	}

	setQSForNewFetch() {
		const celling = this.getCelling();

		const qs = {
			...this.qs,
			start: this.currentCount,
			count: 0,
		};

		const remainingCount = celling - qs.start;

		this.qs = qs;

		this.setCount(remainingCount);

		return this;
	}

	getCelling() {
		return this.desiredCount > this.totalCount
			? this.totalCount
			: this.desiredCount;
	}

	/**
	 * Sets count for QS
	 * @param {number} count necessery for remainingCount & qs.count
	 */
	setCount(count) {
		this.qs.count = count > RecursiveMarketMethod.MAX_PAGE_SIZE || (!count && count !== 0)
			? RecursiveMarketMethod.MAX_PAGE_SIZE
			: count;
	}
}


module.exports = RecursiveMarketMethod;
