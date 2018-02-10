const bot = require('../../bot.js');
const fs = require('fs');

const saveData = () => {
	fs.writeFile('./data/apis.json', JSON.stringify(bot.getCustomApisHandler(), null, 2), 'utf-8', (error) => {
		if (error) {
			throw error;
			return false;
		}
	});
	fs.writeFile('./data/scrapers.json', JSON.stringify(bot.getCustomScrapersHandler(), null, 2), 'utf-8', (error) => {
		if (error) {
			throw error;
			return false;
		}
	});
	fs.writeFile('./data/reactions.json', JSON.stringify(bot.getReactionHandler(), null, 2), 'utf-8', (error) => {
		if (error) {
			throw error;
			return false;
		}
	});
	// fs.writeFile('./data/alerts.json', JSON.stringify(bot.getAlertsHandler(), null, 2), 'utf-8', (error) => {
	// 	if (error) {
	// 		throw error;
	// 		return false;
	// 	}
	// });
	return true;
}

const loadData = () => {
	// APIS
	fs.readFile('./data/apis.json', 'utf-8', (error, data) => {
		let parsedData = getParsedData(error, data);
		if (parsedData) {
			bot.getCustomApisHandler().setCustoms(parsedData.customs);
			bot.setCoins(bot.getCustomApisHandler().buildCoins());
			bot.updateStatusTicker();
		}
	});

	// Scrapers
	fs.readFile('./data/scrapers.json', 'utf-8', (error, data) => {
		let parsedData = getParsedData(error, data);
		if (parsedData) bot.getCustomScrapersHandler().setCustoms(parsedData.customs);
	});

	fs.readFile('./data/reactions.json', 'utf-8', (error, data) => {
		let parsedData = getParsedData(error, data);
		if (parsedData) bot.getReactionHandler().setReactions(parsedData.reactions);
	});

	// fs.readFile('./data/alerts.json', 'utf-8', (error, data) => {
	// 	let parsedData = getParsedData(error, data);
	// 	if (parsedData) bot.getAlertsHandler().setAlerts(parsedData.alerts)
	// });
}

const getParsedData = (error, data) => {
	if (error) throw error;
	else if (data) return JSON.parse(data);
}

const resetData = () => {
	return 'Not supported';
}

module.exports.saveData = saveData;
module.exports.loadData = loadData;
module.exports.resetData = resetData;