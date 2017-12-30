var reactions = [
	{ keyWords: ['raiblocks', 'xrb'] , emojis: ['💥'] },
	{ keyWords: ['ripple'], emojis: ['🇱', '🇴', '🇸', '🇪', '🇷'] },
	{ keyWords: ['joe'] , emojis: ['364473087577554965'] } //custom emojis broken
]

const reactInLine = async (message, emojis) => {
	for (let emoji of emojis) {
		await message.react(emoji);
	}
}

const addReaction = (keyWords, emojis) => {
	let knownReaction = reactions.find((reaction) => reaction.keyWords.includes(keyWords.split(',')[0])) //bug here, need to revisit
	if (knownReaction) {
		knownReaction.keyWords = [...new Set([...knownReaction.keyWords, ...keyWords.split(',')])];
		knownReaction.emojis = [...new Set([...knownReaction.emojis, ...emojis.split(',')])];
	} else {
		reactions.push({ keyWords: keyWords.split(','), emojis: emojis.split(',') })
	}
	return true;
}

module.exports.reactions = reactions;
module.exports.addReaction = addReaction;
module.exports.reactInLine = reactInLine;