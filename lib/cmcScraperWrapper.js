const axios = require('axios');
const cheerio = require('cheerio');
const scrapingUtils = require('./util/scrapingUtils');

const scrapeMarketsFromName = (name) => {
	return axios.get(getEndpoint(name))
							.then((response) => {
								let $ = cheerio.load(response.data);
								let newMarkets = Array.from($('table tbody').children('tr')).map((market) => ({
									name: scrapingUtils.getTextFromNode(market.childNodes[3]),
									pair: scrapingUtils.getTextFromNode(market.childNodes[4]),
									volumePrice: scrapingUtils.getTextFromNode(market.childNodes[6]),
									price: scrapingUtils.getTextFromNode(market.childNodes[8]),
									volumePercentage: scrapingUtils.getTextFromNode(market.childNodes[10]),
									updated: scrapingUtils.getTextFromNode(market.childNodes[12])
								}));
								return newMarkets;
							});
}

const getEndpoint = (name) => {
	return `https://coinmarketcap.com/currencies/${name}/#markets`;
}

module.exports.scrapeMarketsFromName = scrapeMarketsFromName;