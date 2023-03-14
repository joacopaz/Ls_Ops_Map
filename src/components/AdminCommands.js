import React, { useState } from "react";
import styles from "../Mapa.module.css";
import { Button } from "react-bootstrap";
import cog from "../cog.png";
// import DB from "../temp/DB.json";

// script import
import useScripts from "../hooks/useScripts";

export default function AdminCommands({
	data,
	checkPatch,
	setLoading,
	columns,
}) {
	const [active, setActive] = useState(false);
	// Script environment
	const scripts = useScripts(columns);
	//

	const exportData = async () => {
		setLoading(true);
		await checkPatch();
		const cols = columns.map((col) => col.data);
		const finalArrOfObjs = [];
		data.channels.forEach((channel) => {
			const { data } = channel;
			const channelObject = {};
			cols.forEach((col) => (channelObject[col.oldKey] = data[col.column]));
			finalArrOfObjs.push(channelObject);
		});
		finalArrOfObjs.sort((a, b) => a.vc - b.vc);
		scripts.exportData(finalArrOfObjs);

		// console.log(finalObject);
		setLoading(false);
	};

	return (
		<>
			<img
				className={styles.admin}
				src={cog}
				alt="Admin Commands"
				onClick={() => setActive((prev) => !prev)}
			></img>
			<div
				className={
					active
						? `${styles.adminCommandsContainer} ${styles.active}`
						: styles.adminCommandsContainer
				}
			>
				<nav>
					<Button onClick={exportData}>Export XLSX</Button>
					<Button
						onClick={() => scripts.startGoogle()}
						disabled={scripts.fetching}
					>
						{!scripts.fetching ? "Export to Google Sheets" : "Exporting..."}
					</Button>
				</nav>
			</div>
		</>
	);
}
