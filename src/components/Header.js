import React from "react";
import styles from "../Mapa.module.css";

export default function Header({ view, setView }) {
	return (
		<nav className={styles.header}>
			<ul className={styles.navContent}>
				<li
					onClick={() => setView(null)}
					className={view === null ? styles.selected : null}
				>
					Home
				</li>
				<li
					onClick={() => setView("Scripts")}
					className={view === "Scripts" ? styles.selected : null}
				>
					Run Scripts
				</li>
			</ul>
		</nav>
	);
}
