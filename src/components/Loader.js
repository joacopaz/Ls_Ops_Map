import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "../Mapa.module.css";

const Loader = () => {
	return (
		<div className={styles.loader}>
			<Spinner animation="border" role="status" variant="info"></Spinner>
		</div>
	);
};

export default Loader;
