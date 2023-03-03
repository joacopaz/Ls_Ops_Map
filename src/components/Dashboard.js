import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Mapa from "./Mapa";
import useGrant from "../hooks/useGrant";
import AdminCommands from "./AdminCommands";
import useOnLoad from "../hooks/useOnLoad";
import ReportBug from "./ReportBug";

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
	const {
		data,
		loading,
		setData,
		setLoading,
		round,
		propertyToString,
		checkPatch,
	} = useOnLoad();
	return (
		<>
			{currentUser ? (
				<>
					{currentUser.isAdmin && !loading && (
						<AdminCommands
							data={data}
							setLoading={setLoading}
							checkPatch={checkPatch}
						/>
					)}
					<ReportBug user={currentUser.username} setLoading={setLoading} />
					<Mapa
						data={data}
						loading={loading}
						setData={setData}
						setLoading={setLoading}
						round={round}
						propertyToString={propertyToString}
						checkPatch={checkPatch}
					/>
				</>
			) : (
				"This content is restricted"
			)}
		</>
	);
};

export default Dashboard;
