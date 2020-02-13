class RecursiveMarketMethod {
	constructor(qs, request) {
		this.qs = qs;
		this.request = request;

		this.currentCount = 0;
		this.totalCount = 0;
		this.desiredCount = 0;

		this.setCount(this.qs.count)
			.setDesiredCount();
	}

	setDesiredCount() {
		const { start = 0, count } = this.qs;

		if (count > 100) this.desiredCount = parseInt(count) + start;
		else if (!count) this.desiredCount = Infinity;
	}

	shouldFetchNextPage() {
		if (!this.desiredCount) {
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

	setCount(count) {
		this.qs = count > 100 ? 100 : count;

		return this;
	}
}


module.exports = RecursiveMarketMethod;