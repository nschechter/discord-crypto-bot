var jsonpath = require('jsonpath');

const getValue = (data, keySelector, resultNum = 0) => {
	var jp = jsonpath;
	let results = jp.query(data, keySelector);
	return results[resultNum];
	// let pathToKVPair = jp.nodes(data, keySelector).find((node) => node.value === value).path;
	// let parentObj = getParentObj(data, pathToKVPair);	
}

const getParentObjFromValue = (data, key, value) => {

}

const getParentObj = (data, path) => {
	return jp.parent(data, jp.stringify(path));
}

module.exports.getValue = getValue;

// APIClusters have:
