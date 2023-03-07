import React, { useState, useLayoutEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Mapa from "./Mapa";
import useGrant from "../hooks/useGrant";
import AdminCommands from "./AdminCommands";
import useOnLoad from "../hooks/useOnLoad";
import ReportBug from "./ReportBug";
import Footer from "./Footer";
import Header from "./Header";
import ScriptEnvironment from "./ScriptEnvironment";
import Loader from "./Loader";

const Dashboard = () => {
	useGrant();
	return alert(
		"El Mapa está siendo testeado en este momento, en breve ya va a estar disponible de nuevo, porfa usá el de Sharepoint por el momento"
	);
	// const [error, setError] = useState("");
	const [view, setView] = useState(null);
	const [hidden, setHidden] = useState(true);
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
	const {
		data,
		loading,
		setData,
		setLoading,
		round,
		propertyToString,
		checkPatch,
	} = useOnLoad();
	useLayoutEffect(() => {
		if (loading) setHidden(true);
		if (!loading) setHidden(false);
	}, [loading]);
	if (!currentUser) return "This content is restricted";
	return (
		<>
			{hidden ? <Loader /> : null}
			{!hidden ? (
				<Header setView={setView} view={view} isAdmin={currentUser.isAdmin} />
			) : null}
			{
				/*currentUser.isAdmin && */ !hidden && (
					<AdminCommands
						data={data}
						setLoading={setLoading}
						checkPatch={checkPatch}
					/>
				)
			}
			{!hidden && (
				<ReportBug user={currentUser.username} setLoading={setLoading} />
			)}
			{!view && (
				<Mapa
					data={data}
					loading={loading}
					setData={setData}
					setLoading={setLoading}
					round={round}
					propertyToString={propertyToString}
					checkPatch={checkPatch}
				/>
			)}
			{!hidden && view === "Scripts" && (
				<ScriptEnvironment setView={setView} checkPatch={checkPatch} />
			)}

			<Footer />
		</>
	);
};

export default Dashboard;
