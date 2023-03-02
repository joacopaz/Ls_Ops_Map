import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import Loader from "../components/Loader";

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		auth.setPersistence("session");
		const unsub = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});
		return unsub;
	});

	function signup(email, password) {
		return auth.createUserWithEmailAndPassword(email, password);
	}
	function login(email, password) {
		return auth.signInWithEmailAndPassword(email, password);
	}
	function logout() {
		return auth.signOut();
	}
	function recover(email) {
		return sendPasswordResetEmail(auth, email);
	}

	const value = { currentUser, signup, login, logout, recover };

	if (currentUser) {
		currentUser.username = currentUser.email.match(/(.+)@/)[1];
		const admins = process.env.REACT_APP_ADMINS.split(", ");
		currentUser.isAdmin = admins.some((user) => user === currentUser.username);
	}

	return (
		<AuthContext.Provider value={value}>
			{!loading ? children : <Loader />}
		</AuthContext.Provider>
	);
}
