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
	return true;
}

const loadData = () => {
	// APIS
	fs.readFile('./data/apis.json', 'utf-8', (error, data) => {
		if (error) throw error;
		if (data) {
			let parsedData = JSON.parse(data);
			bot.getCustomApisHandler().setApis(parsedData.apis);
			bot.setCoins(bot.getCustomApisHandler().buildCoins());
			bot.updateStatusTicker();
		}
	});

	// Scrapers
	fs.readFile('./data/scrapers.json', 'utf-8', (error, data) => {
		if (error) throw error;
		if (data) {
			let parsedData = JSON.parse(data);
			bot.getCustomScrapersHandler().setScrapers(parsedData.scrapers);
		}
	});
}

const resetData = () => {
	return 'Not supported';
}

module.exports.saveData = saveData;
module.exports.loadData = loadData;
module.exports.resetData = resetData;