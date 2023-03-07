import React, { useRef, useState } from "react";
import styles from "../Mapa.module.css";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "react-bootstrap";
import useScripts from "../hooks/useScripts";
import { read, utils } from "xlsx";
import columnJSON from "../temp/columns.json";
import useWrite from "../hooks/useWrite";

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

export default function ScriptEnvironment({ checkPatch }) {
	const { currentUser } = useAuth();
	const scripts = useScripts();
	const [hasLog, setHasLog] = useState(false);
	const logRef = useRef(null);
	const lastP = useRef(null);
	const { write, del } = useWrite();

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
		if (behavior !== "noClear") clearLog();
		log("Checking latest DB version");
		const latestVersion = await checkPatch();
		if (latestVersion === Number(0)) {
			log("Latest version is already 0, there is no history to delete.");
			log("Forcing updates on all the of the user Databases");
			write("history", "current", { forcedUpdate: Date.now() });
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
					<label>Delete history / Force updates</label>
					<Button disabled={!currentUser.isAdmin} onClick={deleteHistory}>
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
						disabled={!currentUser.isAdmin}
						onClick={async () => {
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
							} catch (err) {
								log(err);
								log("--- SCRIPT ENDED ---");
							}
						}}
					>
						Run
					</Button>
				</div>
				<p>
					Delete completely the current DB and override it with a new XLSX
					sourced DB from a file you upload.
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
