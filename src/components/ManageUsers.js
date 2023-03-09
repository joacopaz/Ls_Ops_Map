import React, { useEffect } from "react";
import useRead from "../hooks/useRead";
import styles from "../Mapa.module.css";

export default function ManageUsers() {
	const { readAll } = useRead();

	useEffect(() => {
		const getUsers = async () => {
			const data = await readAll("users");
			return data;
		};
		getUsers().then((r) => console.log(r));
	});

	return (
		<div
			className={`${styles.scriptEnvContainer} ${styles.mapa} ${styles.manageUsersContainer}`}
		>
			<h2>Manage Users</h2>
			<h5>--- under construction ---</h5>
		</div>
	);
}
