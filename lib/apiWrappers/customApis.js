const axios = require('axios');

const apiUtils = require('../util/apiUtils');

// API has a 

module.exports = class CustomApis {

	constructor() {
		this.apis = [];
	}

	getData(url) {
		return axios.get(url).then((response) => response.data).catch((error) => console.log(error));
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

		foundApi.updater = this.getUpdater(foundApi);
		foundApi.resetUpdater = this.resetUpdater(foundApi);

		return foundApi;
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

  updateDataPoints(API) {
  	return this.getData(API.url).then((data) => {
  		API.dataPoints.forEach((dataPoint) => {
  			dataPoint.value = apiUtils.getValue(data, dataPoint.selector);
  		});
  		return API;
  	});
  }

	getApis() {
		return this.apis;
	}

	getDataPoints() {
		return [].concat.apply([], this.apis.map((api) => api.dataPoints));
	}

	getOrUpdateCoins(coins = {}) {
		return this.getDataPoints().filter((dataPoint) => dataPoint.coin !== "none")
		.reduce((obj, dataPoint) => {
		 if (Object.keys(obj).indexOf(dataPoint.coin) !== -1) {
		 	obj[dataPoint.coin][dataPoint.name] = dataPoint.value;
		 } else {
		 	obj[dataPoint.coin] = {};
		 	obj[dataPoint.coin][dataPoint.name] = dataPoint.value;
		 }
		 return obj;
		}, coins);
	}
	
}