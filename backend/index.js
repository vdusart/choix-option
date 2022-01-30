const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = require('./private/clientId.js');
const client = new OAuth2Client(CLIENT_ID);
const Utils = require('./utils');


const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

var serviceAccount = require("./private/firebaseCreds.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://choix-options-default-rtdb.europe-west1.firebasedatabase.app/"
});
let database = admin.database();

let emailsLocked = [];
database.ref('/emailsLocked').on('value', (snapshot) => {
	emailsLocked = [];
	snapshot.forEach((i) => {
		emailsLocked.push(i.key);
	});
})
let anonymousData = {};
database.ref('/anonymous').on('value', (snapshot) => {
	anonymousData = {};
	snapshot.forEach((i) => {
		anonymousData[i.key] = i.val();
	});
})
let classement = {};
database.ref('/classement').on('value', (snapshot) => {
	classement = {};
	snapshot.forEach((i) => {
		classement[i.key] = i.val();
	});
})

app.post('/getInfosOf', (req, res) => {
	const uid = req.body.uid;
	try {
		let result = anonymousData[uid];
		const option = result["option"];

		for (const [key, value] of Object.entries(classement[option])) {
			const classementOfOption = value["classement"] || [];
			const findIndex = classementOfOption.findIndex(id => id == uid);
			if (findIndex >= 0) {
				result['possibleChoice'] = key;
				result['classement'] = (findIndex + 1) + "/" + value["size"];
				res.json(result);
				return;
			}
		}

	} catch (error) {
		res.json({ error: "Incorrect id" })
	}
})

app.post('/needToImportData', async (req, res) => {
	const tokenId = req.body.tokenId;
	const result = await Utils.isTokenValid(tokenId);
	const emailPrefix = result.email.split('@')[0];
	const needToImportData = (!result.isValid) ? 0 : (!emailsLocked.includes(emailPrefix) ? 1 : 2);
	res.json({ result: needToImportData })
})

app.post('/sendData', async (req, res) => {
	const tokendId = req.body.tokenId;

	const resultTokenValid = await Utils.isTokenValid(tokendId);
	if (!resultTokenValid.isValid) {
		res.json({ result: "error, token invalid" });
		return;
	}
	const email = resultTokenValid.email.split("@")[0];


	const data = req.body.data;
	if (data == undefined) {
		res.json({ result: "error, missing data" });
		return;
	}
	const option = data.option;
	const marks = data.marks;
	const choices = data.choices;
	if (option == undefined || marks == undefined || choices == undefined) {
		res.json({ result: "error, missing data" });
		return;
	}


	if (!Utils.checkMarks(option, marks)) {
		res.json({ result: "error, marks invalid" });
		return;
	}

	if (!Utils.checkChoices(option, choices)) {
		res.json({ result: "error, choices invalid" });
		return;
	}

	const uniqueId = Utils.generateUniqueId(anonymousData);
	const [mean, ECTS] = Utils.calculateMeanAndECTS(option, marks);

	const dataToSend = {
		option: option,
		marks: marks,
		choices: choices,
		mean: mean,
		ECTS: ECTS
	};

	anonymousData[uniqueId] = dataToSend;

	const classement = Utils.createClassement(anonymousData);

	database.ref('/anonymous/' + uniqueId).update(dataToSend);
	database.ref('/emailsLocked/' + email).update({ locked: true });
	database.ref('/classement/').update(classement);
	res.json({ result: uniqueId });
})


app.listen(port);