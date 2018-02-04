const bot = require('../../bot');

const handleCustomCommands = (message) => {
	let args = message.content.split(' ');
	let name = "";
	let url;
	switch (args[1].toLowerCase()) {
		case "add":
			url = args[2];
			let selector = args[3];
			name = args[4];
			bot.getCustomScrapersHandler().addDataPoint(name, url, selector);
		break;
		case "coin":
			let coins = bot.getCoins();
			let msg = "";
			Object.keys(coins).forEach((coinName) => {
				msg += `\nReporting ${coinName}: ${coins[coinName][Object.keys(coins[coinName])[0]]}`;
			});
			message.channel.send(msg);
		break;
		case "api":
			bot.getCustomApisHandler().addDataPoint(args[2], args[3], args[4], args[5]).then((dataPoint) => {
				message.channel.send(`Added ${dataPoint.name} which tracks:\n${dataPoint.selector} - ${dataPoint.value}\nat "${args[2]}".`)
			});
		break;
		case "save":
			if (bot.getDataHandler().saveData()) message.channel.send(`I successfully saved data.`);
			else message.channel.send(`Error saving data.`);
		break;
		default:
			message.channel.send(`Unsupported command: "${message.content}"`);
	}
}

module.exports.handleCustomCommands = handleCustomCommands;