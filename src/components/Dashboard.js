import React, { useState } from "react";
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
	// const [error, setError] = useState("");
	const [view, setView] = useState(null);
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
	if (!currentUser) return "This content is restricted";
	if (loading) return <Loader />;
	return (
		<>
			<Header setView={setView} view={view} />
			{
				/*currentUser.isAdmin && */ <AdminCommands
					data={data}
					setLoading={setLoading}
					checkPatch={checkPatch}
				/>
			}
			{<ReportBug user={currentUser.username} setLoading={setLoading} />}
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
			{view === "Scripts" && (
				<ScriptEnvironment setView={setView} checkPatch={checkPatch} />
			)}

			<Footer />
		</>
	);
};

export default Dashboard;
