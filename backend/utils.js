const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = require('./private/clientId.js');

const client = new OAuth2Client(CLIENT_ID);


class Utils {

	static subjectsGSI = {
		"TC": { "ECE": 1, "LV1": 2.5, "MICRO": 1.5 },
		"INFO": { "ARCH RES": 3, "CYBER": 2, "DES PAT": 3, "JEE": 4.5, "TESTS VERIF": 2 },
		"MATH": { "STATS": 4.5, "IA": 4.5 }
	};

	static subjectsGMI = {
		"TC": { "ECE": 1, "LV1": 2.5, "MICRO": 1.5 },
		"INFO": { "PROG FONC": 3.5, "DECIDABILITE": 2, "ARCH RES": 3, "METH AGIL": 1 },
		"MATH": { "MOD LIN": 2, "DATAMINING": 4.5, "OPTIM": 2, "EDP": 4.5 }
	};

	static choicesGSI = { "BI": 30, "Visual": 30, "INEM": 30, "Cyber": 30, "ICC": 30, "IA Pau": 30, "IA Cergy": 30, "HPDA": 30 };
	static choicesGMI = { "BI": 30, "IA Pau": 30, "IA Cergy": 30, "HPDA": 30, "DS": 30, "Fintech": 30 };

	static generateUniqueId(anonymousData) {
		let tmp;
		do {
			tmp = Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(1, 10);
		} while (tmp in anonymousData);
		return tmp;
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
		for (const UE in subjects) {
			for (const subject in subjects[UE]) {
				if (!(subject in marks)) {
					return false;
				}
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
		for (const choice in choicesOptions) {
			if (!choices.includes(choice)) {
				return false;
			}
		}

		return true;
	}


	static calculateMeanAndECTS(option, marks) {
		const subjects = (option === "GMI") ? Utils.subjectsGMI : Utils.subjectsGSI;
		let ECTS = 0;
		let mean = 0;
		let totalCoef = 0;

		for (const UE in subjects) {
			let meanInUE = 0;
			let coefOfUE = 0;
			for (const subject in subjects[UE]) {
				const mark = marks[subject];
				const coef = subjects[UE][subject];
				meanInUE += mark * coef;
				coefOfUE += coef;
			}
			ECTS += (meanInUE / coefOfUE >= 10) ? coefOfUE : 0;
			mean += meanInUE;
			totalCoef += coefOfUE;
		}

		return [mean / totalCoef, ECTS];
	}


	static createClassement(anonymousData) {
		let classement = {};

		console.log(anonymousData);
	}
}

module.exports = Utils;