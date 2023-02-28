import useWrite from "./useWrite";

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
			GMT: channel.GMT,
			GMTverano: channel["GMT VERANO"],
			actionPack: channel["ACTION PACK"],
			categoria: channel["CATEGORÍA"],
			pass: channel["CONTRASEÑA"],
			tel: channel["TELÉFONO"],
			territorio: channel.TERRITORIO,
			frecuencia: channel.FRECUENCIA,
			grid: channel["FEED | GRILLA"],
			horario: channel.HORARIO,
			contacto: channel.CONTACTO,
			correo: channel.CORREO,
			url: channel.WEB,
			usuario: channel.USUARIO,
			obs: channel.OBSERVACIONES,
			espejos: channel.ESPEJOS,
			spaDesc: channel["DESCRIPCIÓN ESPAÑOL"],
			engDesc: channel["ENGLISH DESCRIPTION"],
			analista: channel.ANALISTA,
			carga: channel.CARGA,
			esclavo: channel.ESCLAVO,
			master: channel.MASTER,
			proveedor: channel.PROVEEDOR,
		}));

		finalDB.forEach(async (channel, i) => {
			await write("channels", `${i}`, channel);
			console.log(`Written channel ${channel.canal}`);
		});
		console.log("UploadDB script finished");
		return;
	};
	return { deleteHistory, uploadDB };
}
