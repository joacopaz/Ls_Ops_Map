import useWrite from "./useWrite";
import { gapi } from "gapi-script";
import { utils, writeFile } from "xlsx";

// const getClient = async () => await auth.getClient();

export default function useScripts() {
	const { write, del } = useWrite();
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
	const useGoogle = async () => {
		let GoogleAuth;
		console.log("Using google");
		gapi.load("client:auth2", loadGoogle);
		async function loadGoogle() {
			try {
				await gapi.client.init({
					apiKey: process.env.REACT_APP_G_API_KEY,
					clientId: process.env.REACT_APP_G_CLIENT_ID,
					scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
					discoveryDocs: [
						"https://sheets.googleapis.com/$discovery/rest?version=v4",
					],
				});
				console.log("Gapi initialized");
				GoogleAuth = gapi.auth2.getAuthInstance();
				GoogleAuth.signIn();
				// const response = await gapi.client.request({
				// 	path: "https://sheets.googleapis.com/v4/spreadsheets",
				// 	method: "POST",
				// });
				// console.log(response);
				// output.innerText = response.body;
			} catch (error) {
				console.log(error);
			}
		}
	};
	// const startGoogle = () => gapi.load("client", useGoogle);
	return { deleteHistory, uploadDB, exportData, uploadColumns, useGoogle };
}
