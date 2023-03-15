import React, { useRef, useState } from "react";
import styles from "../Mapa.module.css";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "react-bootstrap";
import useScripts from "../hooks/useScripts";
import { read, utils } from "xlsx";
import columnJSON from "../temp/columns.json";
import useWrite from "../hooks/useWrite";
import Loader from "./Loader";

const xlsxToJSON = (file) => {
	return new Promise(async (resolve, reject) => {
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
			throw reject("Error reading file");
		};
		reader.readAsBinaryString(file);
	});
};

export default function ScriptEnvironment({ checkPatch, columns }) {
	const [loading, setLoading] = useState(false);
	const { currentUser } = useAuth();
	const scripts = useScripts(columns);
	const [hasLog, setHasLog] = useState(false);
	const logRef = useRef(null);
	const lastP = useRef(null);
	const { write, del, delField } = useWrite();

	const log = (string) => {
		if (!hasLog) setHasLog(true);
		const { current } = logRef;
		const newP = document.createElement("p");
		newP.innerText = string;
		current.appendChild(newP);
		lastP.current = newP;
		lastP.current.scrollIntoView();
	};

	const getFile = () => {
		return new Promise((resolve, reject) => {
			const input = document.createElement("input");
			input.type = "file";
			input.onchange = async ({ target }) => {
				try {
					log("Verifying integrity of the file...");
					if (!target.files[0].name.match(/.xlsx/)) {
						throw reject("File must be .XLSX (excel)");
					}
					const file = target.files[0];
					log("Parsing Excel file and converting to JSON format...");
					const channelArray = await xlsxToJSON(file);
					const columnLength = Object.keys(channelArray[0]).length;
					const idealLength = columnJSON.data.length;
					log("Checking the amount of columns is correct...");
					if (columnLength !== idealLength) {
						throw reject(
							`La base debe tener ${idealLength} columnas, pero la solicitada tiene ${columnLength}!`
						);
					}
					log("Amount of columns is correct!");
					log("Checking the column names match the expected names...");
					columnJSON.data.forEach((col) => {
						if (Object.keys(channelArray[0]).includes(col.oldKey) === false) {
							throw reject(
								`La base cargada no tiene la columna ${
									col.oldKey
								}. Verificar que el EXCEL a cargar tenga las columnas: ${columnJSON.data
									.map((col) => `${col.oldKey}`)
									.join(
										", "
									)} exactamente escritas de esta forma. No hay problema si están vacías pero tienen que estar.`
							);
						}
					});
					log("Column names are correct!");
					log(
						"Uploaded DB matches the expected column length and names, everything is OK!"
					);
					resolve(channelArray);
				} catch (error) {
					log("--- ERROR ---");
				}
			};
			clearLog();
			log("Awaiting user input");
			input.click();
		});
	};

	const eraseCurrentDB = async () => {
		return new Promise(async (resolve) => {
			try {
				log("Proceeding to erase the current DB");
				const localData = JSON.parse(localStorage.getItem("channels"));
				for (const channel of localData) {
					log(`Deleting VC ${channel.data.vc} ${channel.data.canal}`);
					await del("channels", channel.id);
				}
				resolve(log("DB Successfully Deleted"));
			} catch (error) {
				log("--- ERROR ---");
			}
		});
	};

	const clearLog = () => {
		logRef.current.innerHTML = "";
	};

	const deleteHistory = async (behavior) => {
		setLoading(true);
		if (behavior !== "noClear") clearLog();
		log("Checking latest DB version");
		const latestVersion = await checkPatch();
		if (latestVersion === Number(0)) {
			log("Latest version is already 0, there is no history to delete.");
			log("Forcing updates on all the of the user Databases");
			write("history", "current", { forcedUpdate: Date.now() });
			setLoading(false);
			return log("--- SCRIPT ENDED ---");
		}
		log(`Latest version is v${latestVersion}`);
		await scripts.deleteHistory(0, latestVersion, log);
		setLoading(false);
	};
	return (
		<div className={`${styles.scriptEnvContainer} ${styles.mapa}`}>
			{loading ? <Loader /> : null}
			<h2>Scripts</h2>
			<div className={styles.allScriptsContainer}>
				<div className={styles.script}>
					<label>Delete history / Force updates</label>
					<Button
						disabled={!currentUser.isAdmin || loading}
						onClick={deleteHistory}
					>
						Run
					</Button>
				</div>
				<p>
					Delete all history of user created versions and rebase the database to
					version 0 in the current form and make all users re-download it.
				</p>
				<div className={styles.script}>
					<label>Upload DB from Excel (.xlsx)</label>
					<Button
						disabled={!currentUser.isAdmin || loading}
						onClick={async () => {
							setLoading(true);
							try {
								const consents = window.confirm(
									"Please beware of your internet connection while uploading. Do you want to proceed?"
								);
								if (!consents) return;
								const newDB = await getFile();
								await deleteHistory("noClear");
								await eraseCurrentDB();
								await scripts.uploadDB(newDB, log);
								log("--- SCRIPT ENDED ---");
								setLoading(false);
							} catch (err) {
								log(err);
								log("--- SCRIPT ENDED ---");
								setLoading(false);
							}
						}}
					>
						Run
					</Button>
				</div>
				<p>
					Delete completely the current DB and override it with a new XLSX
					sourced DB from a file you upload. Will force all user to download the
					new DB.
				</p>
				{/* <div className={styles.script}>
					<label>Rebase columns to minium Order 1 instead of 0</label>
					<Button
						disabled={!currentUser.isAdmin || loading}
						onClick={async () => {
							clearLog();
							setLoading(true);
							try {
								log("Getting current columns");
								const columns = JSON.parse(localStorage.getItem("columns"));
								log("Creating new order");
								const newOrder = columns
									.map((column) => ({
										id: column.id,
										data: { ...column.data, order: column.data.order + 1 },
									}))
									.sort((colA, colB) => colA.data.order - colB.data.order);
								for (let i = 0; i < newOrder.length; i++) {
									const e = newOrder[i];
									log(`Writing ${e.id} in new order ${e.data.order}`);
									await write("columns", e.id, { order: e.data.order });
								}
								log("--- SCRIPT ENDED ---");
							} catch (err) {
								log(err);
								log("--- SCRIPT ENDED ---");
								setLoading(false);
							}
							setLoading(false);
						}}
					>
						Run
					</Button>
				</div>
				<p>
					Rewrite all columns in Columns collection to the current Order + 1
					(current is 0 based)
				</p> */}
				{/* UPLOAD COLUMNS SCRIPT
				
				 <div className={styles.script}>
					<label>Upload Columns JSON</label>
					<Button
						onClick={async () => {
							const columns = columnJSON;
							for (let i = 0; i < columns.length; i++) {
								const e = columns[i];
								log("Writing " + e.column);
								await write("columns", e.column, e);
							}
							await write("columns", current, 0);
							log("DONE");
						}}
					>
						Run
					</Button>
				</div>
				<p>
					Upload a COLUMNS file to the remote DB in JSON format (must be found
					in the /temp folder).
				</p> */}
				{/* DELETE COL IN ALL CHANNELS 
				<div className={styles.script}>
					<label>Delete specific named col in all channels</label>
					<Button
						onClick={async () => {
							await checkPatch();
							const channels = JSON.parse(localStorage.getItem("channels"));
							for (let i = 0; i < channels.length; i++) {
								const element = channels[i];
								await delField("channels", element.id, "tert");
								log(
									`Deleting all fields in channels ${Math.floor(
										(i / channels.length) * 100
									)}%`
								);
							}
						}}
					>
						Run
					</Button>
				</div>
				<p>
					Upload a COLUMNS file to the remote DB in JSON format (must be found
					in the /temp folder).
					</p>*/}
				{/* FOOTER (ALERT AND CONSOLE) */}
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
