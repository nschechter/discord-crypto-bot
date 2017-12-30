// Command Handlers
var ginaCommands = require('../commands/gina');
var alertCommands = require('../commands/alerts');
var cryptoCommands = require('../commands/crypto');
var customCommands = require('../commands/custom');

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