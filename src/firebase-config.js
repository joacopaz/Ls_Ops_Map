import firebase from "firebase/compat/app";

import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";

const app = firebase.initializeApp(
	{
		apiKey: process.env.REACT_APP_API_KEY,
		authDomain: process.env.REACT_APP_AUTH_DOMAIN,
		databaseURL: process.env.REACT_APP_DATABASEURL,
		projectId: process.env.REACT_APP_POROJECTID,
		storageBucket: process.env.REACT_APP_STORAGEBUCKET,
		messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
		appId: process.env.REACT_APP_APPID,
	}
	// { experimentalAutoDetectLongPolling: true }
);

initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_KEY),
	isTokenAutoRefreshEnabled: true,
});

firebase.firestore().enablePersistence();

export const auth = app.auth();
export const db = getFirestore(app);
export default app;
