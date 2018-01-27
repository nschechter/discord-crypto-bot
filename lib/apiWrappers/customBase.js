// this class provides base functionality for the api and scrapers
// the only difference between the api and scraper classes is the way they fetch data
// so those two classes will now just extend custombase and provide the override function
// which is getValue and that's basically the two selectors - xPath & jsonPath

module.exports = class CustomBase {
	constructor(customs = []) {
		this.customs = customs;
	}

	getData(url) {
		return axios.get(url).then((response) => response.data);
	}

	addDataPoint(message, name, url, selector) {
		let custom = this.getCustomFromUrl(url);

		return this.getData(url).then((data) => {
			let value = this.getValue(data, selector);

			let dataPoint = {
				name: name,
				selector: selector,
				value: value,
				activated: false
			}

			custom.dataPoints.push(dataPoint);
			return dataPoint;
		});
	}

	updateDataPoints(custom) {
  	return this.getData(custom.url).then((data) => {
  		custom.dataPoints.filter((dataPoint) => dataPoint.activated).forEach((dataPoint) => {
  			dataPoint.value = this.getValue(data, dataPoint.selector);
  		});
  		return custom;
  	}).catch((error) => {
  		console.log(`ERROR: Failed while attempting '${custom.url}'.`);
  		return custom;
  	});
  }

  resetUpdater(custom) {
    return () => {
      custom.updater = this.getUpdater(custom);
    }
  }

  getUpdater(custom) {
    return new Promise((resolve, reject) => {
      this.updateDataPoints(custom).then((custom) => {
      	resolve(custom);
      }).catch((error) => reject(error));
    });
  }

 	getCustomFromUrl(url) {
		let custom = this.customs.find((custom) => custom.url === url);

		if (!custom) {
			custom = {
				url: url,
				dataPoints: []
			}

			this.addUpdaterToCustom(custom);

			this.customs.push(custom);
		}

		return custom;
	}

 	confirmDataPoint(url, dataPointName) {
		let custom = getCustomFromUrl(url);
		let dataPoint = custom.dataPoints.find((dataPoint) => dataPoint.name === dataPointName);
		if (dataPoint) return dataPoint.activated = true;
		else return false;
	}

	updateDataPoint(url, dataPointName, selector) {
		let custom = getCustomFromUrl(url);
		let dataPoint = custom.dataPoints.find((dataPoint) => dataPoint.name === dataPointName);
		if (dataPoint) {
			dataPoint.activated = false;
			dataPoint.selector = selector;
		} else return false;
	}

	removeDataPoint(url, dataPointName) {
		let custom = getCustomFromUrl(url);
		custom.dataPoints = custom.dataPoints.filter((dataPoint) => dataPoint.name !== dataPointName);
		return true;
	}

	// Override function
	getValue() {

	}
}