const getTextFromNode = (node) => {
	if (node && node.data && scrubData(node.data).length > 0) {
		return scrubData(node.data);
	} else if (node && node.childNodes) {
		for (let i = 0; i < node.childNodes.length; i += 1) {
			let result = getTextFromNode(node.childNodes[i]);
			if (result) return result;
		}
	} else return false;
}

const getXPathValue = (xPath, xml) => {
	
}

const scrubData = (text) => {
	return text.replace(/\s/g, '');
}

module.exports.getTextFromNode = getTextFromNode;
module.exports.scrubData = scrubData;