import React, { useEffect, useState } from "react";
import { ListGroup, Card, Button } from "react-bootstrap";
import useRead from "../hooks/useRead";
import styles from "../Mapa.module.css";
import User from "./User";

export default function ManageUsers() {
	const { readAll } = useRead();
	const [users, setUsers] = useState(null);
	const [selected, setSelected] = useState(null);

	useEffect(() => {
		if (users) return;
		alert(
			"La seccion de usuarios ya está terminada estéticamente, falta configurar los botones a la brevedad"
		);
		const getUsers = async () => {
			// const data = await readAll("users");
			// localStorage.setItem("users", JSON.stringify(data));
			const users = JSON.parse(localStorage.getItem("users"));
			const orderedUsers = users.sort((a, b) => {
				if (a.data.name < b.data.name) {
					return -1;
				}
				if (a.data.name > b.data.name) {
					return 1;
				}
				return 0;
			});

			setUsers(orderedUsers);
			return orderedUsers;
		};
		getUsers(); //.then((r) => console.log(r));
	});

	return (
		<div
			className={`${styles.scriptEnvContainer} ${styles.mapa} ${styles.manageUsersContainer}`}
		>
			<h2 className="mb-3">Manage Users</h2>

			<div className={styles.usersDashboard}>
				<ListGroup as="ul" className={styles.usersContainer}>
					{users
						? users.map((user, i) => (
								<User
									key={i}
									name={user.data.name}
									id={user.id}
									isAdmin={JSON.stringify(user.data.isAdmin)}
									selected={user.data.name === selected?.name}
									setSelected={setSelected}
								/>
						  ))
						: null}
				</ListGroup>

				<ul className={styles.showUserInfo}>
					<li className="mb-4 text-center">
						<h3>{selected?.name || `Select a user`}</h3>
					</li>
					{selected ? (
						<>
							<li className="mb-4">
								<h6>User ID</h6>{" "}
								<span style={{ fontWeight: "bold" }}>{selected?.id}</span>
							</li>
							<li className="mb-4">
								<h6>Admin status</h6>
								<div
									style={{
										display: "flex",
										justifyContent: "space-around",
										alignItems: "center",
									}}
								>
									<span
										style={
											selected?.isAdmin === "true"
												? { color: "green", fontWeight: "bold" }
												: { color: "red", fontWeight: "bold" }
										}
									>
										{selected?.isAdmin === "true" ? "YES" : "NO"}
									</span>
									<Button
										variant={
											selected?.isAdmin === "true" ? "danger" : "success"
										}
									>
										{selected?.isAdmin === "false"
											? "Grant ADMIN"
											: "Remove ADMIN"}
									</Button>
								</div>
							</li>
							<li
								style={{
									display: "flex",
									justifyContent: "center",
									position: "absolute",
									bottom: "1rem",
								}}
							>
								<Button variant="danger">
									Delete User {selected?.name.toUpperCase()}
								</Button>
							</li>
						</>
					) : null}
				</ul>
			</div>
			<Button className="m-5">Create New User</Button>
		</div>
	);
}
