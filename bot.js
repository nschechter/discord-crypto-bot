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
var dataHandler = require('./lib/handlers/dataHandler');
var Reaction = require('./lib/handlers/reactionHandler');
var Alert = require('./lib/handlers/alertHandler');

const alertHandler = new Alert();
const reactionHandler = new Reaction({
	'raiblocks': ['💥'],
	'xrb': ['💥'],
	'ripple': ['🇱', '🇴', '🇸', '🇪', '🇷'],
	'joe': ['364473087577554965']
});

/*
 * Custom Scrapers & Apis
 */
var CustomScrapers = require('./lib/apiWrappers/customScrapers');
var CustomApis = require('./lib/apiWrappers/customApis');

const CustomScraperHandler = new CustomScrapers([]);
const CustomApiHandler = new CustomApis();

var statusSymbol;
var tickInterval = 30000;
var tick = 0;
var startDate;

var coins;

// Initialize Discord 

const bot = new Discord.Client();
bot.login(auth.token);

// Event Listeners

bot.on('ready', (event) => {

	console.log('Connected');
	startDate = Date.now();
	setup();

});

bot.on('message', (message) => {

	if (message.content.startsWith('!')) {
		commandHandler.handleCommands(message);
	} else {
		checkMessageAndReact(message);
	}

});

bot.on('disconnect', (event) => {
	if (getDataHandler().saveData()) console.log('Saved data');
	else console.log('Unable to save data');
});

// Methods

const setup = () => {
	// BTC data:
	// return Promise.all([
	// this.getCustomApisHandler().addDataPointOffline('https://api.gdax.com/products/BTC-USD/ticker', 
	// 	'$..ask', 'BTC-USD-price', 'BTC'),
	// this.getCustomApisHandler().addDataPointOffline('https://api.gdax.com/products/BTC-USD/ticker', 
	// 	'$..volume', 'BTC-USD-volume', 'BTC'),
	// // ETH data:
	// this.getCustomApisHandler().addDataPointOffline('https://api.gdax.com/products/ETH-USD/ticker',
	// 	'$..ask', 'ETH-USD-price', 'ETH'),
	// this.getCustomApisHandler().addDataPointOffline('https://api.gdax.com/products/ETH-USD/ticker',
	// 	'$..volume', 'ETH-USD-volume', 'ETH'),
	// XRB data:
	// this.getCustomApisHandler().addDataPointOffline('https://bitgrail.com/api/v1/BTC-XRB/ticker', 
	// 	'$..ask', 'BTC-price', 'XRB'),
	// this.getCustomApisHandler().addDataPointOffline('https://bitgrail.com/api/v1/BTC-XRB/ticker', 
	// 	'$..volume', 'BTC-volume', 'XRB'),
	// this.getCustomApisHandler().addDataPointOffline('https://api.kucoin.com/v1/XRB-BTC/open/tick',
	// 	'$..buy', 'XRB-BTC-price', 'XRB'),
	// this.getCustomApisHandler().addDataPointOffline('https://api.kucoin.com/v1/XRB-BTC/open/tick',
	// 	'$..volValue', 'XRB-BTC-volume', 'XRB'),
	// // DBC data:
	// this.getCustomApisHandler().addDataPointOffline('https://api.kucoin.com/v1/DBC-BTC/open/tick',
	// 	'$..buy', 'DBC-BTC-price', 'DBC'),
	// this.getCustomApisHandler().addDataPointOffline('https://api.kucoin.com/v1/DBC-BTC/open/tick',
	// 	'$..volValue', 'DBC-BTC-volume', 'DBC'),
	// // BNTY data: 
	// this.getCustomApisHandler().addDataPointOffline('https://api.kucoin.com/v1/BNTY-BTC/open/tick',
	// 	'$..buy', 'BNTY-BTC-price', 'BNTY'),
	// this.getCustomApisHandler().addDataPointOffline('https://api.kucoin.com/v1/BNTY-BTC/open/tick',
	// 	'$..volValue', 'BNTY-BTC-volume', 'BNTY')]).then((customs) => {
	// 	coins = this.getCustomApisHandler().buildCoins();
	// 	return customs;
	// });
	coins = [];
	getDataHandler().loadData();
	setStatus('XRB');
	setTimeout(updateData, tickInterval);
}

const checkAlerts = () => {
	let alerts = getAlertHandler().getAlerts();
	alerts.forEach((alert) => {
		let dataPoint = getCustomApisHandler().getDataPointByName(alert.dataPointName)
		if (dataPoint) alert.check(dataPoint);
	});
}

const updateStatusTicker = () => {
	let coin = getCoinFromName(statusSymbol);
	let coinPrice = coin[Object.keys(coin).find((key) => key.includes('USD-price'))];
	bot.user.setPresence({ game: { name: `${statusSymbol}: $${coinPrice}`, type: 0 } });
}

const updateData = () => {
	updateCustoms().then(() => { 
		console.log('Updated Customs');
		coins = this.getCustomApisHandler().buildCoins(); 
		checkAlerts(); 
		updateStatusTicker();
	});
	
	tick = tick + 1;
	if (tick == 5) {
		tick = 0;
		if (getDataHandler().saveData()) console.log('Saved data.');
	}
	setTimeout(updateData, tickInterval);
}

const updateCustoms = () => {
	let customs = [].concat([...CustomScraperHandler.getCustoms(), ...CustomApiHandler.getCustoms()]);

	return Promise.all(customs.map((custom) => custom.updater).map(p => p.catch(e => e))).then((usedCustoms) => {
		usedCustoms.forEach((resolvedCustom) => {
			if (resolvedCustom && resolvedCustom.resetUpdater) resolvedCustom.resetUpdater(resolvedCustom);
		});
	}).catch(e => console.log(e));
}

// Needs a refactor
const getPercentageChange = (amt) => {
	let oldPrice = xrbHistory[xrbHistory.length - 1].price
	let newPrice = xrbHistory[xrbHistory.length - (amt - 1)].price
	return (((oldPrice - newPrice) / oldPrice) * 100).toFixed(5);
}

const checkMessageAndReact = (message) => {
	if (message.author === bot.user) return;

	let reactions = reactionHandler.getReactions();
	let result = message.content.toLowerCase().split(' ').find((word) => Object.keys(reactions).includes(word));
	if (result) reactionHandler.reactInLine(message, reactions[result]);
}

// Getters and Setters

const setTickInterval = (interval) => {
	tickInterval = interval;
}

const setStatus = (symbol) => {
	let coin = getCoinFromName(symbol);
	if (coin) {
		statusSymbol = symbol;
		return true;
	} else return false;
}

const getBot = () => {
	return bot;
}

const getAlertHandler = () => {
	return alertHandler;
}

const getCoins = () => {
	return coins;
}

// this is fucking terrible I need to move this
const setCoins = (newCoins) => {
	coins = newCoins;
}

const getCoinFromName = (name) => {
	let coins = getCoins();
	let foundCoin = coins[Object.keys(coins).find((coin) => coin === name)];
	if (!foundCoin) foundCoin = {};
	return foundCoin;
}

const getCoinPrice = (name, transfer) => {
	let coin = getCoinFromName(name.toUpperCase());
	let price = coin[`${name}-${transfer.toUpperCase()}-price`];
	if (price) {
		if (transfer.toUpperCase() === 'USD')
			return `Price (USD): $${price}`;
		else
			return `Price (${transfer.toUpperCase()}): ${price}`;
	}
}

const getCustomScrapersHandler = () => {
	return CustomScraperHandler;
}

const getCustomApisHandler = () => {
	return CustomApiHandler;
}

const getReactionHandler = () => {
	return reactionHandler;
}

const getDataHandler = () => {
	return dataHandler;
}

const getStartDate = () => {
	return startDate;
}

module.exports.getBot = getBot;
module.exports.getAlertHandler = getAlertHandler;
module.exports.getCustomScrapersHandler = getCustomScrapersHandler;
module.exports.getCustomApisHandler = getCustomApisHandler;
module.exports.getReactionHandler = getReactionHandler;
module.exports.getDataHandler = getDataHandler;
module.exports.setStatus = setStatus;
module.exports.setTickInterval = setTickInterval;
module.exports.getCoins = getCoins;
module.exports.setCoins = setCoins;
module.exports.getCoinPrice = getCoinPrice;
module.exports.updateStatusTicker = updateStatusTicker;
module.exports.getStartDate = getStartDate;