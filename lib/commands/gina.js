var reactionHandler = require('../handlers/reactionHandler');

const handleGinaCommands = (message) => {
	let args = message.content.split(' ');
	switch (args[1].toLowerCase()) {
		case "reaction":
			if (reactionHandler.addReaction(args[2], args[3]))
				message.channel.send("Wow that's jeff for you!");
			else
				message.channel.send("DON'T TRY TO BRUCE ME");
		break;
		default:
			message.channel.send('HARK MOLLIS IS MY FAVORITE CHILD');
	}
}

module.exports.handleGinaCommands = handleGinaCommands;