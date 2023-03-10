const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")();
const helmet = require("helmet");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "https://ls-ops-map.web.app" }));
app.use(helmet());
app.use(bodyParser.json());
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

const isAdmin = async (req, res, next) => {
	const { user } = req;
	const docRef = db.collection("users").doc(user.uid);
	try {
		const doc = await docRef.get();
		if (!doc.exists) {
			functions.logger.log("User not found in user docs");
			return res.sendStatus(404);
		} else {
			if (doc.data().isAdmin) {
				functions.logger.log("User is an admin! Everything ok");
				return next();
			}
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
	const userToCreate = req.body.username;
	const passwordToCreate = req.body.password;
	functions.logger.log(`User: ${userToCreate} Password: ${passwordToCreate}`);
	if (!userToCreate || !passwordToCreate) {
		functions.logger.error("NO USER OR PASSWORD IN BODY");
		res
			.status(400)
			.send({ status: "You must include both username and password" });
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

// Delete users at the delete endpoint
app.delete("/users", async (req, res) => {
	const userToDelete = req.body.uid;
	try {
		await admin.auth().deleteUser(userToDelete);
		await db.collection("users").doc(userToDelete).delete();
		functions.logger.log("Deletion successful");
		res.sendStatus(204);
	} catch (error) {
		res.sendStatus(500);
	}
});

exports.api = functions.https.onRequest(app);
