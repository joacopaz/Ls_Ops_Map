import React from "react";
import styles from "../Mapa.module.css";

export default function Header({ view, setView, isAdmin }) {
	return (
		<nav className={styles.header}>
			<ul className={styles.navContent}>
				<li
					onClick={() => setView(null)}
					className={view === null ? styles.selected : null}
				>
					Home
				</li>
				{isAdmin ? (
					<li
						onClick={() => setView("Scripts")}
						className={view === "Scripts" ? styles.selected : null}
					>
						Scripts
					</li>
				) : null}
				{isAdmin ? (
					<li
						onClick={() => setView("ManageUsers")}
						className={view === "ManageUsers" ? styles.selected : null}
					>
						Users
					</li>
				) : null}
				{isAdmin ? (
					<li
						onClick={() => setView("EditDB")}
						className={view === "EditDB" ? styles.selected : null}
					>
						Manage DB
					</li>
				) : null}
			</ul>
		</nav>
	);
}
