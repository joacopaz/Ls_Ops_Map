import React from "react";
import styles from "../Mapa.module.css";

export default function Header({ view, setView, isAdmin, contentRef }) {
	const transitionEffect = (ref, view) => {
		ref.current.style.opacity = 0;
		setTimeout(() => {
			ref.current.style.opacity = 100;
			setView(view);
		}, 200);
	};
	return (
		<nav className={styles.header}>
			<ul className={styles.navContent}>
				<li
					onClick={() => {
						transitionEffect(contentRef, null);
					}}
					className={view === null ? styles.selected : null}
				>
					Home
				</li>
				{isAdmin ? (
					<li
						onClick={() => transitionEffect(contentRef, "Scripts")}
						className={view === "Scripts" ? styles.selected : null}
					>
						Scripts
					</li>
				) : null}
				{isAdmin ? (
					<li
						onClick={() => transitionEffect(contentRef, "ManageUsers")}
						className={view === "ManageUsers" ? styles.selected : null}
					>
						Users
					</li>
				) : null}
				{isAdmin ? (
					<li
						onClick={() => transitionEffect(contentRef, "EditDB")}
						className={view === "EditDB" ? styles.selected : null}
					>
						Manage DB
					</li>
				) : null}
			</ul>
		</nav>
	);
}
