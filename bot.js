/*
 * External Libraries
 */ 
var Discord = require('discord.js');
var axios = require('axios');

/*
 * Constants
 */ 
var auth = require('./auth.json');

/*
 * Bot Utilities & Handlers
 */
var commandHandler = require('./lib/handlers/commandHandler');
var reactionHandler = require('./lib/handlers/reactionHandler');
var alertHandler = require('./lib/handlers/alertHandler');

const alerter = new alertHandler();

/*
 * Custom Scrapers & Apis
 */
var CustomScrapers = require('./lib/apiWrappers/customScrapers');
var CustomApis = require('./lib/apiWrappers/customApis');

const CustomScraperHandler = new CustomScrapers();
const CustomApiHandler = new CustomApis();

var statusTicker = "XRB";
var tickInterval = 30000;

const coins = [];

// Initialize Discord 

const bot = new Discord.Client();
bot.login(auth.token);

// Event Listeners

bot.on('ready', function (evt) {

	console.log('Connected');

	setValues().then((customs) => console.log(customs));
	setTimeout(updateData, tickInterval);

});

bot.on('message', (message) => {

	if (message.content.startsWith('!')) {
		commandHandler.handleCommands(message);
	} else {
		checkMessageAndReact(message);
	}

});

// Methods

const setValues = () => {
	// BTC data:
	return Promise.all([
	this.getCustomApisHandler().addDataPoint('https://api.gdax.com/products/BTC-USD/ticker', 
		'$..bid', 'BTC-USD', 'BTC'),
	this.getCustomApisHandler().addDataPoint('https://api.gdax.com/products/BTC-USD/ticker', 
		'$..volume', 'BTC-USD-volume', 'BTC'),
	// ETH data:
	this.getCustomApisHandler().addDataPoint('https://api.gdax.com/products/ETH-USD/ticker',
		'$..bid', 'ETH-USD', 'ETH'),
	this.getCustomApisHandler().addDataPoint('https://api.gdax.com/products/ETH-USD/ticker',
		'$..volume', 'ETH-USD-volume', 'ETH'),
	// XRB data:
	this.getCustomApisHandler().addDataPoint('https://bitgrail.com/api/v1/BTC-XRB/ticker', 
		'$..bid', 'BTC-XRB', 'XRB'),
	this.getCustomApisHandler().addDataPoint('https://bitgrail.com/api/v1/BTC-XRB/ticker', 
		'$..volume', 'BTC-XRB-volume', 'XRB'),
	// DBC data:
	this.getCustomApisHandler().addDataPoint('https://api.kucoin.com/v1/DBC-BTC/open/tick',
		'$..sell', 'BTC-DBC', 'DBC'),
	this.getCustomApisHandler().addDataPoint('https://api.kucoin.com/v1/DBC-BTC/open/tick',
		'$..volValue', 'BTC-DBC-volume', 'DBC'),
	// BNTY data: 
	this.getCustomApisHandler().addDataPoint('https://api.kucoin.com/v1/BNTY-BTC/open/tick',
		'$..sell', 'BTC-BNTY', 'BNTY'),
	this.getCustomApisHandler().addDataPoint('https://api.kucoin.com/v1/BNTY-BTC/open/tick',
		'$..volValue', 'BTC-BNTY-volume', 'BNTY')]).then((customs) => customs);
}

// Needs a heavy refactor along with the alert handler
const checkAlerts = () => {
	let allCoins = getAllCoins();
	alerter.getAlerts().forEach((alert) => {
		let coin = allCoins.find((coin) => coin.ticker === alert.ticker);
		if (alert.type === "threshold") {
			if (!alert.lessThan && coin.price >= alert.threshold) alerter.broadCast(alert);
			else if (alert.lessThan && coin.price <= alert.threshold) alerter.broadCast(alert);
		}
	});
	alerter.cleanAlerts();
}

const buildCoins = () => {

}

// Needs a refactor
const updateStatusTicker = () => {
	// let btc = getAllCoins().find((coin) => coin.name === 'BTC');
	// getAllCoins().forEach((coin) => {
	// 	if (coin.name === statusTicker) {
	// 		bot.user.setPresence({ game: { name: `${coin.name}: $${coin.price * btc.price}`, type: 0 } });
	// 	}
	// });
}

const updateData = () => {
	// updateCoins().then(() => console.log('Updated Prices'));
	updateCustoms().then(() => console.log('Updated Customs'));
	setTimeout(updateData, tickInterval);
}

const updateCustoms = () => {
	let customs = [].concat([...CustomScraperHandler.getScrapers(), ...CustomApiHandler.getApis()]);

	return Promise.all(customs.map((custom) => custom.updater)).then((usedCustoms) => {
		usedCustoms.forEach((resolvedCustom) => resolvedCustom.resetUpdater(resolvedCustom));
	});
}

// const updateCoins = () => {
// 	return Promise.all(getAllCoins().map((coin) => coin.updater)).then((coins) => {
// 		coins.forEach((resolvedCoin) => resolvedCoin.resetUpdater(resolvedCoin));
// 	});
// }

// Needs a refactor
const getPercentageChange = (amt) => {
	let oldPrice = xrbHistory[xrbHistory.length - 1].price
	let newPrice = xrbHistory[xrbHistory.length - (amt - 1)].price
	return (((oldPrice - newPrice) / oldPrice) * 100).toFixed(5);
}

// Needs a refactor
const getCustomEmoji = (name) => {
	return bot.emojis.find((emoji) => emoji.name === name).id;
}

const checkMessageAndReact = (message) => {
	if (message.author === bot.user) return;

	reactionHandler.reactions.forEach((reaction) => {
		if (reaction.keyWords.some((keyWord) => message.content.toLowerCase().includes(keyWord))) {
			reactionHandler.reactInLine(message, reaction.emojis);
		}
	});
}

// Getters and Setters

const setTickInterval = (interval) => {
	tickInterval = interval;
}

const setStatus = (ticker) => {
	statusTicker = ticker;
}

const getBot = () => {
	return bot;
}

const getAlert = () => {
	return alerter;
}

const getCustomScrapersHandler = () => {
	return CustomScraperHandler;
}

const getCustomApisHandler = () => {
	return CustomApiHandler;
}

module.exports.getBot = getBot;
module.exports.getAlert = getAlert;
module.exports.getCustomScrapersHandler = getCustomScrapersHandler;
module.exports.getCustomApisHandler = getCustomApisHandler;
module.exports.setStatus = setStatus;
module.exports.setTickInterval = setTickInterval;