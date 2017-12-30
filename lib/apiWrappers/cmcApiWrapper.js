const BaseApiWrapper = require('./BaseApiWrapper');

const axios = require('axios');

module.exports = class cmcApiWrapper extends BaseApiWrapper {

  constructor(coins = []) {
  	super('https://api.coinmarketcap.com/v1/ticker', coins);
  }

  getPriceData(ticker) {
    return axios.get(`${this.baseURL}/${ticker}`)
         .then((response) => {
           return response.data[0];
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
        this.updatePrice(coin, parseFloat(data.price_btc));
        resolve(coin);
      }).catch((error) => reject(error));
    });
  }

  updatePrice(coin, price) {
    coin.price = price;
    coin.history.push({ date: Date.now(), price: price });
  }
}