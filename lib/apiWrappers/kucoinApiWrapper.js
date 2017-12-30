class KuCoinApiWrapper extends BaseApiWrapper {

	constructor(coins = []) {
		super("https://api.kucoin.com/v1/open/tick", coins);
	}

	getPriceData(ticker) {
		return axios.get(`${this.baseURL}`)
				 .then((response) => {
				 	 return response.data;
				 });
	}
  
}