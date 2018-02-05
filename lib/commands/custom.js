const bot = require('../../bot');

const commandHelper = require('./commandHelper');

const handleCustomCommands = (message) => {
	let args = message.content.split(' ');
	let name, url, selector;
	switch (args[1].toLowerCase()) {
		case "xpath":
			url = args[2];
			selector = args[3];
			name = args[4];
			bot.getCustomScrapersHandler().addDataPoint(name, url, selector).then((dataPoint) => {
				message.channel.send(`Successfully added datapoint - ${dataPoint.name} to track ${dataPoint.value}
					Please activate the datapoint using !custom activate ${dataPoint.name}`);
			}).error((error) => message.channel.send(commandHelper.getError('xpath')));
		break;
		case "jsonpath":
			url = args[2];
			selector = args[3];
			name = args[4];
			bot.getCustomApisHandler().addDataPoint(name, url, selector).then((dataPoint) => {
				message.channel.send(`Successfully added datapoint - ${dataPoint.name} to track ${dataPoint.value}
					Please activate the datapoint using !custom activate ${dataPoint.name}`);
			}).error((error) => message.channel.send(commandHelper.getError('jsonpath')));
		break;
		case "activate":
			let dataPointName = args[2];
			let dataPoint = bot.getDataPointByName(dataPointName);
			if (dataPoint) { 
				dataPoint.activated = true;
				message.channel.send(`Activated ${dataPoint.name}`);
			} else message.channel.send(commandHelper.getError('activate'));
		break;
		case "deactivate":
			let dataPointName = args[2];
			let dataPoint = bot.getDataPointByName(dataPointName);
			if (dataPoint) { 
				dataPoint.activated = false;
				message.channel.send(`Deactivated ${dataPoint.name}`);
			} else message.channel.send(commandHelper.getError('deactivate'));
		break;
		case "coin":
			let coins = bot.getCoins();
			let msg = "";
			Object.keys(coins).forEach((coinName) => {
				msg += `\nReporting ${coinName}: ${coins[coinName][Object.keys(coins[coinName])[0]]}`;
			});
			message.channel.send(msg);
		break;
		case "save":
			if (bot.getDataHandler().saveData()) message.channel.send(`I successfully saved data.`);
			else message.channel.send(`Error saving data.`);
		break;
		case "help":

		break;
		default:
			message.channel.send(`Unsupported command: "${message.content}"`);
	}
}

module.exports.handleCustomCommands = handleCustomCommands;