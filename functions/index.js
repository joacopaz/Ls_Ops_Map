const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")();
const helmet = require("helmet");
const cors = require("cors")({ origin: true });
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors);
app.use(cookieParser);

admin.initializeApp();

const db = admin.firestore();

const validateFirebaseIdToken = async (req, res, next) => {
	if (
		(!req.headers.authorization ||
			!req.headers.authorization.startsWith("Bearer ")) &&
		!(req.cookies && req.cookies.__session)
	) {
		functions.logger.error("Invalid token");
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
app.use(validateFirebaseIdToken);

// const appCheckVerification = async (req, res, next) => {
// 	const appCheckToken = req.header("X-Firebase-AppCheck");
// 	if (!appCheckToken) res.status(401).send("App Check not passed");
// 	try {
// 		const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);
// 		return next();
// 	} catch (err) {
// 		res.status(401).send("App check not passed");
// 	}
// };
// app.use(appCheckVerification)

const isAdmin = async (req, res, next) => {
	const { user } = req;
	const docRef = db.collection("users").doc(user.uid);
	try {
		const doc = await docRef.get();
		if (!doc.exists) {
			res.sendStatus(404);
		} else {
			if (doc.data().isAdmin) return next();
			res.sendStatus(401);
		}
	} catch (error) {
		res.sendStatus(500);
	}
};
app.use(isAdmin);

// We have verified the user is signed in with a valid firebase token and is an admin
// Create users at the post endpoint
app.post("/users", async (req, res) => {
	// manage users and admin creation here
	const userToCreate = req.body.user;
	const passwordToCreate = req.body.password;
	functions.logger.log(`User: ${userToCreate} Password: ${passwordToCreate}`);
	if (!userToCreate || !passwordToCreate) {
		functions.logger.error("NO USER OR PASSWORD IN BODY");
		res.status(400).send({ status: "no user and password in body" });
	}
	try {
		// Creating the user in firebase auth
		const userCreated = await admin.auth().createUser({
			email: `${userToCreate}@dtvpan.com`,
			password: passwordToCreate,
		});
		// Creating the user in users DB
		const data = {
			isAdmin: false,
			name: userToCreate,
		};
		await db.collection("users").doc(userCreated.uid).set(data);
		res.status(201).send({ status: "Success!", newUserId: userCreated.uid });
	} catch (error) {
		res.status(500).send(error);
	}
});

// Delete users at the delete endpoing
app.delete("/users", async (req, res) => {
	// const userToDelete = req.body.user;
	const collection = db.collection("users");
	// FIX QUERY BY FIELD PATH
	const data = await collection
		.where(db.FieldPath.documentId().isEqual("1JZNRJB3m9TPG3GDfWmEIs3mYS23"))
		.get();
	res.json(data);
	const results = [];
	data.forEach((res) => results.push(res));
	// res.send("done");
});

exports.api = functions.https
	.onCall((data, context) => {
		if (!context.app) {
			throw new functions.https.HttpsError(
				"failed-precondition",
				"The function must be called from an App Check verified app."
			);
		}
	})
	.https.onRequest(app);
