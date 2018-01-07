const axios = require('axios');

const apiUtils = require('../util/apiUtils');

// API has a 

module.exports = class CustomApis {

	constructor() {
		this.apis = [];
	}

	getData(url) {
		return axios.get(url).then((response) => response.data);
	}

	addDataPoint(url, selector, name, coin = "none") {
		let api = this.getApiFromUrl(url);

		return this.getData(url).then((data) => {
			let value = apiUtils.getValue(data, selector);
			let dataPoint = {
				coin: coin,
				name: name,
				selector: selector,
				value: value
			}

			api.dataPoints.push(dataPoint);
			return dataPoint;
		});
	}

	addCoin(url, coinName, pairingCoin) {
		let priceKeyWords = ['ask', 'buy', 'askPrice', 'AskPrice'];
		let api = this.getApiFromUrl(url);

		return this.getData(url).then((data) => {
			let value = "";
			let selector = "";
			for (let i = 0; i < priceKeyWords.length; i++) {
				selector = `$..${priceKeyWords[i]}`
				value = apiUtils.getValue(data, selector);
				if (value) break;
			};

			if (!value) return `I cannot retrieve details for ${coinName} from ${url}.`;

			let dataPoint = {
				coin: coinName,
				name: `${coinName}-${pairingCoin.toUpperCase()}-price`,
				selector: selector,
				value: value
			}

			api.dataPoints.push(dataPoint);
			return `Successfully added ${coinName}`;
		})
	}

	addDataPointOffline(url, selector, name, coin = "none") {
		let api = this.getApiFromUrl(url);

		let dataPoint = {
			coin: coin,
			name: name,
			selector: selector,
			value: undefined
		}

		api.dataPoints.push(dataPoint);
		return dataPoint;
	}

	getApiFromUrl(url) {
		let foundApi = this.apis.find((api) => api.url === url);
		if (!foundApi) {
			foundApi = {
				url: url,
				dataPoints: []
			}

			this.apis.push(foundApi);
		}

		this.addUpdaterToApi(foundApi);

		return foundApi;
	}

	addUpdaterToApi(API) {
		API.updater = this.getUpdater(API);
		API.resetUpdater = this.resetUpdater(API);
	}

	updateDataPoints(API) {
  	return this.getData(API.url).then((data) => {
  		API.dataPoints.forEach((dataPoint) => {
  			dataPoint.value = apiUtils.getValue(data, dataPoint.selector);
  		});
  		return API;
  	}).catch((error) => console.log(`ERROR: Failed while attempting '${API.url}'.`));
  }

  resetUpdater(API) {
    return () => {
      API.updater = this.getUpdater(API);
    }
  }

  getUpdater(API) {
    return new Promise((resolve, reject) => {
      this.updateDataPoints(API).then((API) => {
      	resolve(API);
      }).catch((error) => reject(error));
    });
  }

  getUpdater2(API) {
  	return () => {
  		this.updateDataPoints(API).then((updatedAPI) => {
  			updatedAPI.updater = this.getNewUpdater(updatedAPI);
  			console.log(`Updated datapoints on: ${updatedAPI.url}`);
  		}).catch((error) => console.log(error));
  	}
  }

	getApis() {
		return this.apis;
	}

	setApis(apis) {
		this.apis = apis;
		this.apis.forEach((api) => this.addUpdaterToApi(api));
	}

	getDataPoints() {
		return [].concat.apply([], this.apis.map((api) => api.dataPoints));
	}

	getDataPointByName(name) {
		return this.getDataPoints().find((dataPoint) => dataPoint.name === name);
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
	
}