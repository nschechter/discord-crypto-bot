// this whole thing needs to be refactored to be compatible with custom scrapers / apis

var bot = require('../../Bot');

const handleAlertCommands = (message) => {
	let args = message.content.split(' ');
	switch(args[1].toLowerCase()) {
		case "set":
			bot.getAlertHandler().addAlert(message, args[2], args[3], args[4], args[5]);
		break;
		case "remove":
			bot.getAlertHandler().removeAlert(message, args[2]);
		break;
		case "all":
			let alerts = bot.getAlertHandler().getAlerts();
			message.channel.send(alerts.map((alert) => {
				return `\n${alert.name} - ${alert.type} - ${alert.dataPointName} - ${alert.operator} - ${alert.threshold}`;
			}));
		break;
		default:
			message.channel.send(`Unsupported command: "${message.content}"`);
	}
}

module.exports.handleAlertCommands = handleAlertCommands;