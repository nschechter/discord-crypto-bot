// this whole thing needs to be refactored to be compatible with custom scrapers / apis

var bot = require('../../bot');

const handleAlertCommands = (message) => {
	let args = message.content.split(' ');
	switch(args[1].toLowerCase()) {
		case "set":
			let type = args[2].toLowerCase();
			if (type === "threshold") {
				bot.getAlert().addThresholdAlert(message, args[3], args[4] === '<', parseFloat(args[5]));
			} else if (type === "trend") {
				message.channel.send("not yet");
			}
		break;
		case "remove":
			message.channel.send('not yet');
		break;
		case "all":
			let alerts = bot.getAlert().getAlerts();
			message.channel.send(alerts);
		break;
		default:
			message.channel.send(`Unsupported command: "${message.content}"`);
	}
}

module.exports.handleAlertCommands = handleAlertCommands;