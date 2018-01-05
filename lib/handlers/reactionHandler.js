module.exports = class ReactionsHandler {

	constructor(reactions = []) {
		this.reactions = reactions;
	}

	addReaction(keyWord, emojis) {
		//[keyWord] = [...emojis.split(',')]
	}

	async reactInLine(message, emojis) {
		for (let emoji of emojis) {
			await message.react(emoji);
		}
	}

	getReactions() {
		return this.reactions;
	}

}

// Needs a refactor
const getCustomEmoji = (name) => {
	return bot.emojis.find((emoji) => emoji.name === name).id;
}