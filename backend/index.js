const express = require('express');
const admin = require('firebase-admin');
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = require('./private/clientId.js');
const client = new OAuth2Client(CLIENT_ID);

const app = express();
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


async function isTokenValid(token) {
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
		result.isValid = email.split('@')[1] != "cy-tech.fr";
	} catch (error) {
		result.isValid = false;
	}
	return result;
}


app.post('/tokenId', async (req, res) => {
	const tokenId = req.body.tokenId;
	const result = await isTokenValid(tokenId);
	res.send(result.isValid && !emailsLocked.includes(result.email));
})


app.listen(port);