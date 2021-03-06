var bot = require('../../Bot');

const handleGinaCommands = (message) => {
	let args = message.content.split(' ');
	switch (args[1].toLowerCase()) {
		case "reaction":
			if (args[2] === "all") {
				message.channel.send(Object.keys(bot.getReactionHandler().getReactions()).map((key) => `${key} - ${bot.getReactionHandler().getReactions()[key]}\n`));
			} else {
				if (bot.getReactionHandler().addReaction(args[2], args[3]))
					message.channel.send("Wow that's jeff for you!");
				else
					message.channel.send("DON'T TRY TO BRUCE ME");
			}
		break;
		case "tell":
			let user = bot.getBot().users.find((user) => user.username.toLowerCase().includes(args[2].toLowerCase()));
			if (!user) return message.channel.send(`I cannot find someone with the username of ${args[2]}.`);
			let msg = args.slice(3, args.length).join(' ');
			message.channel.send(`${user.toString()}, ${msg}`);
		break;
		default:
			message.channel.send('HARK MOLLIS IS MY FAVORITE CHILD');
	}
}

module.exports.handleGinaCommands = handleGinaCommands;