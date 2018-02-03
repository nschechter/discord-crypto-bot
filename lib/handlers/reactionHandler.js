module.exports = class ReactionsHandler {

	constructor(reactions = {}) {
		this.reactions = reactions;
	}

	addReaction(keyWord, emojis) {
		return this.reactions[keyWord] = getCleanEmojis(emojis);
	}

	removeReaction(keyWord) {
		return delete this.reactions[keyWord];
	}

	setReactions(reactions) {
		this.reactions = reactions;
	}

	getReactions() {
		return this.reactions;
	}

	async reactInLine(message, emojis) {
		for (let emoji of emojis) {
			await message.react(emoji);
		}
	}

	getCleanEmojis(emojis) {
		let splitEmojis = emojis.split(',');
		splitEmojis = splitEmojis.map((emoji) => {
			emoji[0] === '<' ? emoji.split(':')[1].substring(0, emoji.split(':')[1].length - 1)
		)};
		return splitEmojis;
	}

}

// Needs a refactor
const getCustomEmoji = (name) => {
	return bot.emojis.find((emoji) => emoji.name === name).id;
}