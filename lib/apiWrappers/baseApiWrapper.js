module.exports = class BaseApiWrapper {
 
  constructor(baseURL, coins = []) {
    this.baseURL = baseURL;
    this.coins = coins;
  }

  getCoins() {
    return this.coins;
  }

  getPrices() {
  	return this.coins.map((coin) => {
  		return `${coin.name}: ${coin.price}`;
  	});
  }

}