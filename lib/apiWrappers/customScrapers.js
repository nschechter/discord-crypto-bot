const CustomBase = require('./customBase');

const scrapingUtils = require('../util/scrapingUtils');

module.exports = class CustomScrapers extends CustomBase {

	constructor(customs = []) {
		super(customs);
	}

	getValue(selector, data) {
		return scrapingUtils.getXPathValue(selector, data);
	}
}