import useWrite from "./useWrite";
import { gapi } from "gapi-script";
import { utils, writeFile } from "xlsx";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import columnsJSON from "../temp/columns.json";
// const getClient = async () => await auth.getClient();

export default function useScripts() {
	const { write, del } = useWrite();
	const [isSigned, setIsSigned] = useState(null);
	const { currentUser } = useAuth();
	const [fetching, setFetching] = useState(false);

	const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;
	// button for deleting history, set to delete from 0.01 to 0.09
	const deleteHistory = async (start, finish) => {
		for (let index = start; index <= finish; round(index + 0.01)) {
			await del("history", `v${index}`);
			console.log(`Deleted v${index}`);
		}
	};
	const uploadDB = async (jsonObject) => {
		const finalDB = jsonObject.DB.map((channel) => ({
			img: `https://www.directv.com.ar/content/dam/public-sites/channels/${channel.VC}.png`,
			vc: channel.VC,
			canal: channel.CANAL,
			territorio: channel.TERRITORIO,
			frecuencia: channel.FRECUENCIA,
			GMT: channel.GMT,
			GMTverano: channel["GMT VERANO"],
			grid: channel["FEED | GRILLA"],
			horario: channel.HORARIO,
			contacto: channel.CONTACTO,
			correo: channel.CORREO,
			tel: channel["TELÉFONO"],
			actionPack: channel["ACTION PACK"],
			url: channel.WEB,
			usuario: channel.USUARIO,
			pass: channel["CONTRASEÑA"],
			obs: channel.OBSERVACIONES,
			espejos: channel.ESPEJOS,
			categoria: channel["CATEGORÍA"],
			spaDesc: channel["DESCRIPCIÓN ESPAÑOL"],
			engDesc: channel["ENGLISH DESCRIPTION"],
			analista: channel.ANALISTA,
			carga: channel.CARGA,
			esclavo: channel.ESCLAVO,
			master: channel.MASTER,
			proveedor: channel.PROVEEDOR,
			type: channel.TYPE,
			sid: channel.SID,
		}));

		await finalDB.forEach(async (channel, i) => {
			await write("channels", `${i}`, channel);
			console.log(`Written channel ${channel.canal}`);
		});
		console.log("UploadDB script finished");
		return;
	};

	const exportData = (data) => {
		try {
			const filename = "mapa.xlsx";
			const ws = utils.json_to_sheet(data);
			const wb = utils.book_new();
			utils.book_append_sheet(wb, ws, "People");
			writeFile(wb, filename);
		} catch (error) {
			console.log(error);
		}
	};

	const uploadColumns = async (jsonObject) => {
		const { data } = jsonObject;
		await data.forEach(async (column, i) => {
			await write("columns", `${i}`, column);
			console.log(`Written column ${column.title}`);
		});
		console.log("Upload Columns script finished");
		return;
	};
	async function startGoogle() {
		setFetching(true);
		// Start google auth process
		await new Promise(async (r) => {
			let GoogleAuth;
			console.log("Using google");
			if (!isSigned) {
				window.alert(
					"Si no tenés usuario de google podés usar el usuario: lsopsmap@gmail.com y la pass Directv2023"
				);
				await gapi.load("client:auth2", loadGoogle);
			}
			if (isSigned) r();
			async function loadGoogle() {
				try {
					await gapi.client.init({
						apiKey: process.env.REACT_APP_G_API_KEY,
						clientId: process.env.REACT_APP_G_CLIENT_ID,
						scope: "https://www.googleapis.com/auth/drive.file",
						discoveryDocs: [
							"https://sheets.googleapis.com/$discovery/rest?version=v4",
						],
					});
					GoogleAuth = gapi.auth2.getAuthInstance();
					await GoogleAuth.isSignedIn.listen(setIsSigned(true));
					console.log("Gapi initialized");
					await GoogleAuth.signIn();
					r();
				} catch (error) {
					console.log(error);
				}
			}
		});
		// Give time for cache to get settled
		await new Promise((r) => setTimeout(r, 500));
		// Create new google sheet
		const sheetId = await new Promise(async (r) => {
			const date = new Date();
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();
			const dateString = `${day}/${month}/${year.toString().substring(2)}`;
			const createSpreadsheet = async (title, callback) => {
				try {
					const response = await gapi.client.sheets.spreadsheets.create({
						properties: {
							title: title,
						},
					});
					if (callback) await callback(response);
					return response.result.spreadsheetId;
				} catch (error) {
					console.log(error);
				}
			};
			const sheetId = await createSpreadsheet(
				`Ls Ops Map Export ${dateString} ${currentUser.username}`
			);
			r(sheetId);
		});

		// Update sheet with the DB data
		async function updateSheet(spreadsheetId = sheetId) {
			const channels = JSON.parse(localStorage.getItem("channels"));
			const columnNames = columnsJSON.data.map((col) => col.title);
			const values = [columnNames];
			const channelData = channels.map((e) => {
				return columnsJSON.data.map((col) => e.data[col.column]);
			});
			channelData.forEach((channel) => values.push(channel));
			const body = {
				values: values,
			};
			try {
				const response = await gapi.client.sheets.spreadsheets.values.update({
					spreadsheetId: spreadsheetId,
					resource: body,
					range: "Sheet1!A:AD",
					valueInputOption: "RAW",
				});
				const result = response.result;
				console.log(`${result.updatedCells} cells updated.`);
			} catch (err) {
				console.log(err.message);
				return;
			}
		}
		await updateSheet();

		// Format sheet
		async function batchUpdate(spreadsheetId = sheetId) {
			const requests = [];
			// Make first row filters
			requests.push({
				setBasicFilter: {
					filter: {
						range: {
							sheetId: 0,
							startRowIndex: 0,
							endRowIndex: 1,
							startColumnIndex: 0,
							endColumnIndex: columnsJSON.length - 1,
						},
					},
				},
			});
			// Center text
			requests.push({
				repeatCell: {
					range: { sheetId: 0 },
					cell: {
						userEnteredFormat: {
							horizontalAlignment: "CENTER",
							verticalAlignment: "MIDDLE",
						},
					},
					fields: "userEnteredFormat(horizontalAlignment, verticalAlignment) ",
				},
			});
			requests.push({
				autoResizeDimensions: {
					dimensions: {
						sheetId: 0,
						dimension: "COLUMNS",
					},
				},
			});
			requests.push({
				updateSheetProperties: {
					properties: {
						sheetId: 0,
						title: "DB",
					},
					fields: "title",
				},
			});
			try {
				const batchUpdateRequest = { requests: requests };
				await gapi.client.sheets.spreadsheets.batchUpdate({
					spreadsheetId: spreadsheetId,
					resource: batchUpdateRequest,
				});
			} catch (err) {
				console.log(err.result.error.message);
				return;
			}
		}
		await batchUpdate();
		setFetching(false);
		window.open(`https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`);
	}

	return {
		deleteHistory,
		uploadDB,
		exportData,
		uploadColumns,
		startGoogle,
		fetching,
	};
}
