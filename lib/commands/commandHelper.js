const errors = {
	jsonpath: `**Command:** !custom jsonpath name_of_datapoint url selector\n**Selector Instructions:** Follow http://goessner.net/articles/JsonPath/`,
	xpath: `**Command:** !custom xpath name_of_datapoint url selector\n**Selector Instructions:** Inspect element, right click element and copy xPath value`,
	activate: `**Command:** !custom activate jsonpath|xpath name_of_datapoint`,
	deactivate: `**Command:** !custom deactivate jsonpath|xpath name_of_datapoint`,
	custom_all: `**Command:** !custom all jsonpath|xpath`
}

const getError = (command) => {
	return errors[command];
}

module.exports.getError = getError;