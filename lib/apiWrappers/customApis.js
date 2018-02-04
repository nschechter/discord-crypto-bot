const apiUtils = require('../util/apiUtils');

const CustomBase = require('./CustomBase');

module.exports = class CustomApis extends CustomBase {

	constructor(customs = []) {
		super(customs);
	}

	addCoin(url, coinName, pairingCoin) {
		let priceKeyWords = ['ask', 'buy', 'askPrice', 'AskPrice'];
		let custom = this.getCustomFromUrl(url);

		return this.getData(url).then((data) => {
			let value = "";
			let selector = "";
			for (let i = 0; i < priceKeyWords.length; i++) {
				selector = `$..${priceKeyWords[i]}`
				value = apiUtils.getValue(selector, data);
				if (value) break;
			};

			if (!value) return `I cannot retrieve details for ${coinName} from ${url}.`;

			let dataPoint = {
				coin: coinName,
				name: `${coinName}-${pairingCoin.toUpperCase()}-price`,
				selector: selector,
				value: value
			}

			custom.dataPoints.push(dataPoint);
			return `Successfully added ${coinName}`;
		})
	}

	buildCoins(coins = {}) {
		// Coins have a BTC or ETH price
		return this.getDataPoints().filter((dataPoint) => dataPoint.coin !== "none")
		.reduce((obj, dataPoint) => {
			if (Object.keys(obj).indexOf(dataPoint.coin) !== -1) {
				obj[dataPoint.coin][dataPoint.name] = dataPoint.value;
			} else {
				obj[dataPoint.coin] = {};
				obj[dataPoint.coin][dataPoint.name] = dataPoint.value;
			}

			if (dataPoint.name.includes('BTC-price')) {
				let btcPrice = parseFloat(this.getDataPoints().find((dataPoint) => dataPoint.name === 'BTC-USD-price').value);
				obj[dataPoint.coin][`${dataPoint.coin}-USD-price`] = dataPoint.value * btcPrice;
			} else if (dataPoint.name.includes('ETH-price')) {
				let ethPrice = parseFloat(this.getDataPoints().find((dataPoint) => dataPoint.name === 'ETH-USD-price').value);
				obj[dataPoint.coin][`${dataPoint.coin}-USD-price`] = dataPoint.value * ethPrice;
			}
			return obj;
		}, coins);
	}
	
	getValue(selector, data) {
		return apiUtils.getValue(selector, data);
	}
}