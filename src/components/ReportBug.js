import React, { useState } from "react";
import useWrite from "../hooks/useWrite";
import styles from "../Mapa.module.css";
import icon from "../warning.png";

export default function ReportBug({ user, setLoading }) {
	const [showPrompt, setShowPrompt] = useState(false);
	const { write } = useWrite();
	const reportBug = async () => {
		const report = window.confirm(
			`Estás a punto de reportar un bug a nombre de ${user}. Esto es correcto?`
		);
		if (report) {
			const bugReport = window.prompt(
				"Por favor describe el inconveniente. Será loggeado y atendido según prioridad."
			);
			if (bugReport) {
				setLoading(true);
				const timestamp = `${new Date()}`;
				const dataObj = { [timestamp]: bugReport };
				await write("bugs", user, dataObj);
				setLoading(false);
				alert("El reporte se ha enviado con éxito");
			}
		}
	};

	return (
		<>
			<img
				className={styles.bugReport}
				src={icon}
				alt="bug report icon"
				onClick={reportBug}
				onMouseEnter={() => setShowPrompt(true)}
				onMouseLeave={() => setShowPrompt(false)}
			/>
			<div
				className={styles.textPrompt}
				style={showPrompt ? { opacity: "100%" } : { opacity: "0%" }}
			>
				Report bug
			</div>
		</>
	);
}
