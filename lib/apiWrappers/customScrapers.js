const axios = require('axios');

const CustomBase = require('./customBase');

const scrapingUtils = require('../util/scrapingUtils');

module.exports = class CustomScrapers extends CustomBase {

	constructor(customs = []) {
		super(customs);
	}

	getValue(data, selector) {
		return this.scrapingUtils.getXPathValue(data, selector);
	}
}