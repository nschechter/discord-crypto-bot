var bot = require('../../bot');

const handleGinaCommands = (message) => {
	let args = message.content.split(' ');
	switch (args[1].toLowerCase()) {
		case "reaction":
			if (bot.getReactionHandler().addReaction(args[2], args[3]))
				message.channel.send("Wow that's jeff for you!");
			else
				message.channel.send("DON'T TRY TO BRUCE ME");
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