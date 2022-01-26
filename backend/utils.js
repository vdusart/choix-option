const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = require('./private/clientId.js');

const client = new OAuth2Client(CLIENT_ID);


class Utils {

	static subjectsGSI = { "ECE": 1, "LV1": 2.5, "Micro": 1.5, "Archi Reseau": 3, "Cyber": 2, "DES PAT": 3, "JEE": 4.5, "Stats": 4.5, "IA": 4.5, "Tests verif": 2 };
	static subjectsGMI = ["ECE", "LV1", "Micro", "ARCH RES", "DECIDABILITE", "METH AGIL", "PROG FONC", "DATAMINING", "EDP", "MOD LIN", "OPTIM"];

	static choicesGSI = ["BI", "Visual", "INEM", "Cyber", "ICC", "IA Pau", "IA Cergy", "HPDA"];
	static choicesGMI = ["BI", "IA Pau", "IA Cergy", "HPDA", "DS", "Fintech"];

	static generateUniqueId() {
		// TODO: check if id is unique
		return Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(1, 10);
	}

	static isTokenValid = async (token) => {
		let result = {
			"isValid": false,
			"email": ""
		}
		try {
			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: CLIENT_ID,
			});
			const payload = ticket.getPayload();
			const email = payload.email;
			result.email = email;
			result.isValid = email.split('@')[1] == "cy-tech.fr";
		} catch (error) {
			result.isValid = false;
		}
		return result;
	}

	static checkMarks(option, marks) {
		const subjects = (option === "GMI") ? Utils.subjectsGMI : Utils.subjectsGSI;
		for (const subject in subjects) {
			if (!(subject in marks)) {
				return false;
			}
		}

		for (const [key, value] of Object.entries(marks)) {
			try {
				const mark = parseInt(value, 10) || -1;
				if (mark < 0 || mark > 20) {
					return false;
				}
			} catch (error) {
				return false;
			}
		}

		return true;
	}

	static checkChoices(option, choices) {
		const choicesOptions = (option === "GMI") ? Utils.choicesGMI : Utils.choicesGSI;
		for (const choice of choicesOptions) {
			if (!choices.includes(choice)) {
				return false;
			}
		}

		return true;
	}
}

module.exports = Utils;