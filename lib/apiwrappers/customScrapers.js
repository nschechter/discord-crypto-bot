const CustomBase = require('./CustomBase');

const scrapingUtils = require('../util/ScrapingUtils');

module.exports = class CustomScrapers extends CustomBase {

	constructor(customs = []) {
		super(customs);
	}

	getValue(selector, data) {
		return scrapingUtils.getXPathValue(selector, data);
	}
}