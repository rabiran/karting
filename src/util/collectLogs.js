const fn = require("../config/fieldNames");
const fs = require('fs');
const moment = require('moment');

/**
 * 
 * @param {Object} idObj - an object of { identityCard, personalNumber, domainUser } 
 * @param {String} runUID - the unique id of the karting run that came from luigi
 * @returns - array of the logs and the name of the logs file 
 */
module.exports = async (idObj, runUID) => {
	const date = moment(new Date()).format("YYYY-MM-DD");
	const path = `${fn.luigiLogsPath}/${date}`;
	const files = fs.readdirSync(`${path}/`);
	let fileName;
	for (const idField of Object.values(idObj)) {		
		fileName = files.find(
			file => file.startsWith(`${runUID}-${idField}`)
			);
		if (fileName)
			break;
	}

	const logs = fs.readFileSync(`${path}/${fileName}`, {encoding: 'utf-8'}).toString().split("\n");
	logs.pop(); // remove last element empty line

	return {logs, fileName};

}
