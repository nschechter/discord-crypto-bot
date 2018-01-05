var bot = require('../../bot');

const handleCryptoCommands = (message) => {
	let args = message.content.split(' ');
	let ticker;
	let name;
	switch (args[1].toLowerCase()) {
		case "price":
			name = args[2];
			let price = bot.getCoinPrice(name, args[3] || "BTC");
			if (price) message.channel.send(`Reporting:\n${price}`);
			else message.channel.send(`I am not tracking ${name} in ${args[3]}`);
		break;
		case "status":
			symbol = args[2];
			if (bot.setStatus(symbol)) {
				message.channel.send(`I will now report the price of ${symbol} under my status.`);
			} else message.channel.send(`I am not tracking ${symbol}.`);
		break;
		case "add":
			bot.getCustomApisHandler().addCoin(args[2], args[3], args[4]).then((result) => {
				message.channel.send(result);
			});
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