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
	databaseURL: "https://choix-option-default-rtdb.europe-west1.firebasedatabase.app/"
});
let database = admin.database();

let emailsLocked = [];
database.ref('/emailsLocked').on('value', (snapshot) => {
	emailsLocked = [];
	snapshot.forEach((i) => {
		emailsLocked.push(i.val());
	});
})
let anonymousData = {};
database.ref('/anonymous').on('value', (snapshot) => {
	anonymousData = [];
	snapshot.forEach((i) => {
		anonymousData[i.key] = i.val();
	});
})



app.post('/needToImportData', async (req, res) => {
	const tokenId = req.body.tokenId;
	const result = await Utils.isTokenValid(tokenId);
	const needToImportData = (!result.isValid) ? 0 : (!emailsLocked.includes(result.email) ? 1 : 2);
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
	const option = data.option;
	const marks = data.marks;
	if (true && !Utils.checkMarks(option, marks)) {
		res.json({ result: "error, marks invalid" });
		return;
	}

	const choices = data.choices;
	if (!Utils.checkChoices(option, choices)) {
		res.json({ result: "error, choices invalid" });
		return;
	}

	const uniqueId = Utils.generateUniqueId();
	const dataToSend = {
		option: option,
		marks: marks,
		choices: choices
	};

	database.ref('/anonymous/' + uniqueId).update(dataToSend);
	database.ref('/emailsLocked/' + email).update({ locked: true });
	res.json({ result: uniqueId });
})


app.listen(port);