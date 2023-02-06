import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Mapa from "./Mapa";
import useGrant from "../hooks/useGrant";
import PopupControllers from "./PopupControllers";
const Dashboard = () => {
	useGrant();
	// const [error, setError] = useState("");
	const { currentUser /*, logout*/ } = useAuth();
	/*
	We won't be handling Logout since it's a closed app
	async function handleLogout() {
		setError("");
		try {
			await logout();
		} catch (err) {
			setError(
				`Failed to log out: ${err.code
					.match(/\/(.+)/)[1]
					.replace(new RegExp(/-/, "g"), " ")}`
			);
		}
	}*/
	return (
		<>
			{currentUser ? (
				<>
					<Mapa />
					<PopupControllers />
				</>
			) : (
				"This content is restricted"
			)}
		</>
	);
};

export default Dashboard;
