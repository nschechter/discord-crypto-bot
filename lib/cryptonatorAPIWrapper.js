// Unused and deprecated

var axios = require('axios');

const baseURL = 'https://api.cryptonator.com/api/full';

var coins = [];

const getMarketsFromTicker = (ticker) => {
	return axios.get(`${baseURL}/${ticker}-BTC`)
							.then((response) => {
								let marketData = response.data.ticker.markets;
								return marketData.map((market) => market.market);
							})
							.catch((error) => {
								console.log(error);
							});
}

const getCoins = () => {
	return coins;
}

const addCoin = (ticker) => {
	coins.push(ticker);
}

module.exports.getMarketsFromTicker = getMarketsFromTicker;
module.exports.getSupportedCoins = getSupportedCoins;
module.exports.addSupportedCoin = addSupportedCoin;