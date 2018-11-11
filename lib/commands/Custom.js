const bot = require('../../Bot');

const commandHelper = require('./commandHelper');

const handleCustomCommands = (message) => {
	let args = message.content.split(' ');
	let name, url, selector;
	let dataPointName, customName, dataPoint;
	switch (args[1].toLowerCase()) {
		case "xpath":
			url = args[2];
			selector = args[3];
			name = args[4];
			bot.getCustomScrapersHandler().addDataPoint(name, url, selector).then((dataPoint) => {
				message.channel.send(`Successfully added datapoint - ${dataPoint.name} to track ${dataPoint.value}
					Please activate the datapoint using !custom activate ${dataPoint.name}`);
			}).catch((error) => message.channel.send(commandHelper.getError('xpath')));
		break;
		case "jsonpath":
			url = args[2];
			selector = args[3];
			name = args[4];
			bot.getCustomApisHandler().addDataPoint(name, url, selector).then((dataPoint) => {
				message.channel.send(`Successfully added datapoint - ${dataPoint.name} to track ${dataPoint.value}
					Please activate the datapoint using !custom activate ${dataPoint.name}`);
			}).catch((error) => message.channel.send(commandHelper.getError('jsonpath')));
		break;
		case "activate":
			customName = args[2];
			dataPointName = args[3];
			dataPoint = bot.getDataPointByName(customName, dataPointName);
			if (dataPoint) { 
				dataPoint.activated = true;
				message.channel.send(`Activated ${dataPoint.name}`);
			} else message.channel.send(commandHelper.getError('activate'));
		break;
		case "deactivate":
			customName = args[2];
			dataPointName = args[3];
			dataPoint = bot.getDataPointByName(customName, dataPointName);
			if (dataPoint) { 
				dataPoint.activated = false;
				message.channel.send(`Deactivated ${dataPoint.name}`);
			} else message.channel.send(commandHelper.getError('deactivate'));
		break;
		case "all":
			customName = args[2];
			if (customName && customName === 'jsonpath' || 'xpath') {
				let customs = (customName === 'jsonpath' ? bot.getCustomApisHandler().getCustoms() : bot.getCustomScrapersHandler().getCustoms());
				message.channel.send(customs.reduce((arr, custom) => arr.concat(custom.dataPoints), []).map((dataPoint) => {
					return `${dataPoint.name} - ${dataPoint.activated} - ${dataPoint.selector} - ${dataPoint.value}`
				}));
			} else message.channel.send(commandHelper.getError('custom_all'));
		break;
		case "coin":
			let coins = bot.getCoins();
			message.channel.send((Object.keys(coins)).map((coinName) => {
				return `\n ${coinName} - ${coins[coinName][Object.keys(coins[coinName])[0]]}`;
			}));
		break;
		case "save":
			if (bot.getDataHandler().saveData()) message.channel.send(`I successfully saved data.`);
			else message.channel.send(commandHelper.getError('save'));
		break;
		case "help":
			message.channel.send(`!custom jsonpath|xpath name_of_datapoint url selector`);
		break;
		default:
			message.channel.send(`Unsupported command: "${message.content}"`);
	}
}

module.exports.handleCustomCommands = handleCustomCommands;