var bot = require('../../bot');

const handleCryptoCommands = (message) => {
	let args = message.content.split(' ');
	let ticker;
	let name;
	switch (args[1].toLowerCase()) {
		case "price":
			name = args[2];
			let coin = bot.getCoinFromName(name);
			if (coin) message.channel.send(`Reporting ${coin.price} for ${coin.name}`);
			else message.channel.send(`I am not tracking ${name}, maybe trying adding it?`);
		break;
		case "status":
			ticker = args[2];
			bot.setStatus(ticker);
			message.channel.send(`I will now report the price of ${ticker} as my status.`);
		break;
		case "add":
			name = args[2];
			ticker = args[3];
			bot.addCoin(name, ticker, exchange);
			message.channel.send(`Now tracking ${name} (${ticker}) via - ${exchange}`)
		break;
		case "interval":
			interval = parseInt(args[2]);
			if (interval >= 5000) {
				bot.setTickInterval(interval);
				message.channel.send(`Set interval to ${interval}`)
			} else {
				message.channel.send(`Cannot set interval below 5000.`);
			}
		break;
		default:
			message.channel.send(`Unsupported command: "${message.content}"`);
	}
}

module.exports.handleCryptoCommands = handleCryptoCommands;