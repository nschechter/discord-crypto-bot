const BaseApiWrapper = require('./BaseApiWrapper');

const axios = require('axios');

module.exports = class gdaxApiWrapper extends BaseApiWrapper {

	constructor(coins = []) {
  	super('https://api.gdax.com/products', coins);
  }

	getPriceData(ticker) {
		return axios.get(`${this.baseURL}/${ticker}/ticker`)
				 .then((response) => {
				 	 return response.data;
				 });
	}

	addCoin(name, ticker) {
    let coin = { 
      name: name,
      ticker: ticker,
      price: 0,
      history: []
    };

    coin.updater = this.getUpdater(coin);
    coin.resetUpdater = this.resetUpdater(coin);

    this.coins.push(coin);
  }

  resetUpdater(coin) {
    return () => {
      coin.updater = this.getUpdater(coin);
      // console.log(`Price: ${coin.name} - ${coin.price}, reset updater`);
    }
  }

  getUpdater(coin) {
    return new Promise((resolve, reject) => {
      this.getPriceData(coin.ticker).then((data) => {
        this.updatePrice(coin, parseFloat(data.bid));
        resolve(coin);
      }).catch((error) => resolve(error));
    });
  }

  updatePrice(coin, price) {
		coin.price = price;
		//coin.history.push({ date: Date.now(), price: price });
  }
}