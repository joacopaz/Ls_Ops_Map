import React, { useState } from "react";
import { useRef } from "react";
import styles from "../Mapa.module.css";
import { Button } from "react-bootstrap";
import cog from "../cog.png";

// script import
import useScripts from "../hooks/useScripts";

export default function AdminCommands({ data, checkPatch, setLoading }) {
	const [active, setActive] = useState(false);

	// Script environment
	const scripts = useScripts();
	const btn = useRef(null);
	//

	const exportData = async () => {
		setLoading(true);

		await checkPatch();
		const finalObject = [];
		data.channels.forEach((channel) => {
			const { data } = channel;
			finalObject.push({
				ID: channel.id,
				VC: data.vc,
				CANAL: data.canal,
				TERRITORIO: data.territorio,
				FRECUENCIA: data.frecuencia,
				GMT: data.GMT,
				"GMT VERANO": data.GMTverano,
				"FEED | GRILLA": data.grid,
				HORARIO: data.horario,
				CONTACTO: data.contacto,
				CORREO: data.correo,
				TELÉFONO: data.tel,
				"ACTION PACK": data.actionPack,
				WEB: data.url,
				USUARIO: data.usuario,
				PASSWORD: data.pass,
				OBSERVACIONES: data.obs,
				ESPEJOS: data.espejos,
				CATEGORÍA: data.categoria,
				"DESCRIPCIÓN ESPAÑOL": data.spaDesc,
				"ENGLISH DESCRIPTION": data.engDesc,
				ANALISTA: data.analista,
				CARGA: data.carga,
				ESCLAVO: data.esclavo,
				MASTER: data.master,
				PROVEEDOR: data.proveedor,
			});
		});
		finalObject.sort((a, b) => a.ID - b.ID);
		scripts.exportData(finalObject);

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
					<ul>
						<li>
							<Button ref={btn} onClick={exportData}>
								Export XLSX
							</Button>
						</li>
					</ul>
				</nav>
			</div>
		</>
	);
}
