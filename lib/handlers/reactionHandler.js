module.exports = class ReactionsHandler {

	constructor(reactions = {}) {
		this.reactions = reactions;
	}

	addReaction(keyWord, emojis) {
		return this.reactions[keyWord] = [...emojis.split(',')]
	}

	removeReaction(keyWord) {
		return delete this.reactions[keyWord];
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