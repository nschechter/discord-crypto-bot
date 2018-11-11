// Command Handlers
var ginaCommands = require('../commands/Gina');
var alertCommands = require('../commands/Alerts');
var cryptoCommands = require('../commands/Crypto');
var customCommands = require('../commands/Custom');

const handleCommands = (message) => {
	let command = message.content.split(' ')[0].toLowerCase();

	switch (command) {
		case "!gina":
			ginaCommands.handleGinaCommands(message);
		break;
		case "!alert":
			alertCommands.handleAlertCommands(message);
		break;
		case "!crypto":
			cryptoCommands.handleCryptoCommands(message);
		break;
		case "!custom":
			customCommands.handleCustomCommands(message);
		break;
		default:
			message.channel.send(`Unsupported command: "${message.content}"`);
	}
}

module.exports.handleCommands = handleCommands;