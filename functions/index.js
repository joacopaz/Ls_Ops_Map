const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const app = express();

admin.initializeApp();

const db = admin.firestore();

// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req, res, next) => {
	if (
		(!req.headers.authorization ||
			!req.headers.authorization.startsWith("Bearer ")) &&
		!(req.cookies && req.cookies.__session)
	) {
		console.log.logger.error("Invalid token");
		res.status(403).send("Unauthorized");
		return;
	}

	let idToken;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer ")
	) {
		functions.logger.log('Found "Authorization" header');
		// Read the ID Token from the Authorization header.
		idToken = req.headers.authorization.split("Bearer ")[1];
	} else if (req.cookies) {
		functions.logger.log('Found "__session" cookie');
		// Read the ID Token from cookie.
		idToken = req.cookies.__session;
	} else {
		// No cookie
		res.status(403).send("Unauthorized");
		return;
	}

	try {
		const decodedIdToken = await admin.auth().verifyIdToken(idToken);
		functions.logger.log("ID Token correctly decoded");
		req.user = decodedIdToken;
		next();
		return;
	} catch (error) {
		functions.logger.error("Error while verifying Firebase ID token:", error);
		res.status(403).send("Unauthorized");
		return;
	}
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get("/myhomepage", (req, res) => {
	const { user } = req;
	functions.logger.log(user.uid);
	res.status(200).send({ data: "user is authed!" });
});

exports.myhomepage = functions.https.onRequest(app);
