const bot = require('../../bot');

const handleCustomCommands = (message) => {
	let args = message.content.split(' ');
	let name = "";
	switch (args[1].toLowerCase()) {
		case "add":
			let url = args[2];
			let selector = message.content.split('"')[1] || message.content.split("'")[1];
			name = args[args.length - 1];
			bot.getCustomScrapersHandler().addScraper(message, name, url, selector);
		break;
		case "activate":
			name = args[2];
			bot.getCustomScrapersHandler().activateScraper(message, name);
		case "omit":
			name = args[2];
			let omittedCharacters = args[3];
			bot.getCustomScrapersHandler().editScraper(message, name, omittedCharacters);
		break;
		case "value":
			name = args[2];
			let scraper = bot.getCustomScrapersHandler().getScraper(name);
			debugger;
			if (scraper) message.channel.send(`Value: ${scraper.info}`);
			else message.channel.send(`Error: I could not find a scraper with name: ${name}`);
		break;
		case "remove":
			bot.getCustomScrapersHandler().removeScraper(message, args[2]);
		break;
		default:
			message.channel.send(`Unsupported command: "${message.content}"`);
	}
}

module.exports.handleCustomCommands = handleCustomCommands;