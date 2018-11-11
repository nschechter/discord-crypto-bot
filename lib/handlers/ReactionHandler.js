module.exports = class ReactionsHandler {

	constructor(reactions = {}) {
		this.reactions = reactions;
	}

	addReaction(keyWord, emojis) {
		return this.reactions[keyWord] = this.getCleanEmojis(emojis);
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
		let splitEmojis = emojis.split(',').map((emoji) => {
			return emoji.replace('\\', '')[0] === '<' ? emoji.split(':')[2].substring(0, emoji.split(':')[2].length - 1) : emoji
		});
		return splitEmojis;
	}

}