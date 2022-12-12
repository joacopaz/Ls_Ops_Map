import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import styles from "../Mapa.module.css";

const MultiChannelAlert = ({ sharedVcs }) => {
	useEffect(() => {
		setShow(true);
	}, [sharedVcs]);
	const [show, setShow] = useState(true);
	return (
		<Alert show={show} variant="warning" className="mb-0 mt-2 text-center">
			<div className="d-flex"></div>
			VC Compartido entre{" "}
			{sharedVcs.map((e, i) => {
				if (i === 0) return e.data.canal;
				if (i === sharedVcs.length - 1) return ` y ${e.data.canal}`;
				return `, ${e.data.canal} `;
			})}{" "}
			<div className={styles.closeAlert} onClick={() => setShow(false)}>
				x
			</div>
		</Alert>
	);
};

export default MultiChannelAlert;
