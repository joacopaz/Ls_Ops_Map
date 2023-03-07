import React, { useRef, useState } from "react";
import styles from "../Mapa.module.css";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "react-bootstrap";
import useScripts from "../hooks/useScripts";
import { read, utils } from "xlsx";
import columnJSON from "../temp/columns.json";

const xlsxToJSON = (file) => {
	return new Promise(async (resolve, reject) => {
		console.log("Running JSON conversion");
		const reader = new FileReader();
		reader.onload = async ({ target }) => {
			const data = target.result;
			const workbook = read(data, { type: "binary" });
			workbook.SheetNames.forEach((sheetName) => {
				const rowObject = utils.sheet_to_row_object_array(
					workbook.Sheets[sheetName]
				);
				resolve(rowObject);
			});
		};
		reader.onerror = (e) => {
			console.log("Error reading file");
			console.log(e.target.error);
			reject();
		};
		reader.readAsBinaryString(file);
	});
};

export default function ScriptEnvironment({ checkPatch }) {
	const { currentUser } = useAuth();
	const scripts = useScripts();
	const [hasLog, setHasLog] = useState(false);
	const logRef = useRef(null);
	const lastP = useRef(null);

	const getFile = () => {
		return new Promise((r) => {
			const input = document.createElement("input");
			input.type = "file";
			input.onchange = async ({ target }) => {
				if (!target.files[0].name.match(/.xlsx/)) {
					return alert("File must be .XLSX (excel)");
				}
				const file = target.files[0];
				console.log("Running parser with file");
				const channelArray = await xlsxToJSON(file);
				const columnLength = Object.keys(channelArray[0]).length;
				const idealLength = columnJSON.data.length;
				if (columnLength !== idealLength)
					return alert(
						`La base debe tener ${idealLength} columnas, pero la solicitada tiene ${columnLength}!`
					);
				columnJSON.data.forEach((col) => {
					if (Object.keys(channelArray[0]).includes(col.oldKey) === false)
						return alert(
							`Can not find a ${
								col.oldKey
							} column in the Excel file. Please check that all columns match ${columnJSON.data
								.map((col) => `"${col.oldKey}"`)
								.join(", ")}`
						);
				});
				console.log("Uploaded DB fulfills parameters for successful upload");
				r(channelArray);
			};
			input.click();
		});
	};

	const log = async (string) => {
		if (!hasLog) setHasLog(true);
		const { current } = logRef;
		const newP = document.createElement("p");
		newP.innerText = string;
		current.appendChild(newP);
		lastP.current = newP;
		await new Promise((r) => setTimeout(r, 500));
		lastP.current.scrollIntoView();
	};

	const clearLog = () => {
		logRef.current.innerHTML = "";
	};

	const deleteHistory = async () => {
		clearLog();
		await log("Checking latest DB version");
		const latestVersion = await checkPatch();
		if (latestVersion === Number(0)) {
			await log("Latest version is already 0, there is no history to delete.");
			return log("--- SCRIPT ENDED ---");
		}
		log(`Latest version is v${latestVersion}`);
		await scripts.deleteHistory(0, latestVersion, log);
	};
	return (
		<div className={`${styles.scriptEnvContainer} ${styles.mapa}`}>
			<h2>Scripts</h2>
			<div className={styles.allScriptsContainer}>
				<div className={styles.script}>
					<label>Delete history</label>
					<Button disabled={!currentUser.isAdmin} onClick={deleteHistory}>
						Run
					</Button>
				</div>
				<p>
					Delete all history of user created versions and rebase the database to
					version 0 (forcing a re-download of the current DB to all users on
					login)
				</p>
				<div className={styles.script}>
					<label>Upload DB from Excel (.xlsx)</label>
					<Button disabled={!currentUser.isAdmin} onClick={getFile}>
						Run
					</Button>
				</div>
				<p>
					Delete completely the current DB and override it with a new XLSX
					sourced DB from a file you upload. ***CURRENTLY IN DEVELOPMENT,
					DISABLED FOR NOW***
				</p>
				{currentUser.isAdmin ? (
					<Alert
						variant="danger"
						className="text-center position-absolute bottom-0 w-100 mb-0"
					>
						Scripts can only be run by admins
					</Alert>
				) : null}
			</div>

			<div className={styles.console}>
				<span>Console</span>
				{!hasLog ? (
					<p className={styles.noScript}>Currently not running any scripts</p>
				) : null}
				<div ref={logRef}></div>
			</div>
		</div>
	);
}
