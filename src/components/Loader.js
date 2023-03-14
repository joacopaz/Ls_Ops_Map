import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "../Mapa.module.css";

const Loader = ({ message }) => {
	return (
		<>
			<div className={styles.loader}>
				<Spinner animation="border" role="status" variant="info"></Spinner>
				{message ? (
					<div
						style={{
							backgroundColor: "black",
							color: "white",
							position: "absolute",
							width: "max-content",
							bottom: "-5rem",
							padding: "1rem",
							borderRadius: "15px",
							border: "1px solid white",
						}}
					>
						{message}
					</div>
				) : null}
			</div>
		</>
	);
};

export default Loader;
