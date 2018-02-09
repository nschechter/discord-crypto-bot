const errors = {
	"jsonpath": `Command: !custom jsonpath name_of_datapoint url selector
	Selector Instructions:\nFollow http://goessner.net/articles/JsonPath/`,
	"xpath": `Command: !custom xpath name_of_datapoint url selector
	Selector Instructions:\nInspect element, right click element and copy xPath value`,
	"activate": `Command: !custom activate name_of_datapoint`
	"deactivate": `Command: !custom deactivate name_of_datapoint`
}

export const getError = (command) => {
	return errors[command];
}

module.exports.getError = getError;