import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import Loader from "../components/Loader";
import useRead from "../hooks/useRead";

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);
	const { read, readAll } = useRead();
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
		currentUser.accessToken = currentUser._delegate.accessToken;
		console.log(currentUser.accessToken);
		read("users", currentUser.uid)
			.then((r) => (currentUser.isAdmin = r.isAdmin))
			.catch((err) => console.log(err));
	}

	return (
		<AuthContext.Provider value={value}>
			{!loading ? children : <Loader />}
		</AuthContext.Provider>
	);
}
