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
 * API Wrappers
 */
var cmcApiWrapper = require('./lib/apiWrappers/cmcApiWrapper');
var gdaxApiWrapper = require('./lib/apiWrappers/gdaxApiWrapper');
var bitgrailApiWrapper = require('./lib/apiWrappers/bitgrailApiWrapper');

const coinMarketCap = new cmcApiWrapper();
const GDAX = new gdaxApiWrapper();
const bitGrail = new bitgrailApiWrapper();

/*
 * Custom Scrapers & Apis
 */
var CustomScrapers = require('./lib/apiWrappers/customScrapers');
var CustomApis = require('./lib/apiWrappers/customApis');

const CustomScraperHandler = new CustomScrapers();
const CustomApiHandler = new CustomApis();

var statusTicker = "XRB";
var tickInterval = 30000;

// Initialize Discord 

const bot = new Discord.Client();
bot.login(auth.token);

// Event Listeners

bot.on('ready', function (evt) {

	console.log('Connected');

	setValues();
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
	// coinMarketCap.addCoin('OST', 'simple-token');
	GDAX.addCoin('BTC', 'BTC-USD'); // NAME PARAMETER
	bitGrail.addCoin('XRB', 'BTC-XRB');
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

const getAllCoins = () => {
	let coins = [
		GDAX.getCoins(),
		// coinMarketCap.getCoins(), 
		bitGrail.getCoins()
	];
	return [].concat(...coins);
}

const getCoinFromName = (name) => {
	return getAllCoins().find((coin) => coin.name === name);
}


// Needs a refactor
const updateStatusTicker = () => {
	let btc = getAllCoins().find((coin) => coin.name === 'BTC');
	getAllCoins().forEach((coin) => {
		if (coin.name === statusTicker) {
			bot.user.setPresence({ game: { name: `${coin.name}: $${coin.price * btc.price}`, type: 0 } });
		}
	});
}

const updateData = () => {
	updateCoins().then(() => { console.log('Updated Prices'); checkAlerts(); updateStatusTicker() });
	updateCustoms().then(() => console.log('Updated Customs'));
	setTimeout(updateData, tickInterval);
}

const updateCustoms = () => {
	let customScrapersAndApis = [].concat([...CustomScraperHandler.getScrapers(), ...CustomApiHandler.getApis()]);

	return Promise.all(customScrapersAndApis.map((custom) => custom.updater)).then((customs) => {
		customs.forEach((resolvedCustom) => resolvedCustom.resetUpdater(resolvedCustom));
	});
}

const updateCoins = () => {
	return Promise.all(getAllCoins().map((coin) => coin.updater)).then((coins) => {
		coins.forEach((resolvedCoin) => resolvedCoin.resetUpdater(resolvedCoin));
	});
}

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
module.exports.getCoinFromName = getCoinFromName;