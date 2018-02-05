const errors = {
	"jsonpath": `Command: !custom jsonpath name_of_datapoint url selector
	Selector Instructions:\nFollow `,
	"xpath": `Command: !custom xpath name_of_datapoint url selector
	Selector Instructions:\nInspect element, right click element and copy xPath value`
}

export const getError = (command) => {
	return errors[command];
}

module.exports.getError = getError;