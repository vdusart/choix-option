
class Utils {

	static CLIENT_ID;
	static client;

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

	static choicesGSI = { "BI": 15, "Visual": 30, "INEM": 30, "Cyber": 30, "ICC": 30, "IA Pau": 15, "IA Cergy": 30, "HPDA": 15 };
	static choicesGMI = { "BI": 15, "IA Pau": 15, "IA Cergy": 30, "HPDA": 15, "DS": 30, "Fintech": 30 };

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
			const ticket = await this.client.verifyIdToken({
				idToken: token,
				audience: this.CLIENT_ID,
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

	static createClassementStructure() {
		let classement = {};

		classement["GSI"] = {};
		for (const choice in Utils.choicesGSI) {
			classement["GSI"][choice] = { "size": Utils.choicesGSI[choice], "classement": [] };
		}
		classement["GMI"] = {};
		for (const choice in Utils.choicesGMI) {
			classement["GMI"][choice] = { "size": Utils.choicesGMI[choice], "classement": [] };
		}

		return classement;
	}

	static createClassement(anonymousData) {
		let classement = {};
		classement = Utils.createClassementStructure();

		var studentsSorted = Object.keys(anonymousData).map((key) => [key, anonymousData[key]]);

		studentsSorted.sort(
			(a, b) => {
				const ECTSA = a[1]["ECTS"];
				const ECTSB = b[1]["ECTS"];
				const meanA = a[1]["mean"];
				const meanB = b[1]["mean"];
				return (ECTSA != ECTSB) ? (ECTSB - ECTSA) : meanB - meanA;
			}
		);

		for (const element of studentsSorted) {
			const studentId = element[0];
			const student = element[1];
			const studentOption = student["option"];

			let possibleChoice;
			let optionSize;
			let optionClassementLength;
			let i = 0;
			do {
				possibleChoice = student.choices[i];
				i++;
				optionSize = classement[studentOption][possibleChoice]["size"];
				optionClassementLength = classement[studentOption][possibleChoice]["classement"].length;
			} while ((optionClassementLength + 1 > optionSize) && (i < 8));

			classement[studentOption][possibleChoice]["classement"].push(studentId);
		}
		return classement;
	}
}

module.exports = Utils;