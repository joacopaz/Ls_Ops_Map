import React, { useRef, useEffect, useState } from "react";
import { ListGroup, Button } from "react-bootstrap";
import useRead from "../hooks/useRead";
import styles from "../Mapa.module.css";
import User from "./User";
import Loader from "./Loader";
import { useAuth } from "../contexts/AuthContext";
import useWrite from "../hooks/useWrite";

export default function ManageUsers() {
	const { readAll } = useRead();
	const [users, setUsers] = useState(null);
	const [selected, setSelected] = useState(null);
	const [loading, setLoading] = useState(false);
	const { write } = useWrite();
	const fetched = useRef(null);
	const { currentUser } = useAuth();
	useEffect(() => {
		if (fetched.current) return;
		const getUsers = async () => {
			setLoading(true);
			fetched.current = true;
			const users = await readAll("users");
			// localStorage.setItem("users", JSON.stringify(users));
			// const users = JSON.parse(localStorage.getItem("users"));
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
		getUsers().then(() => setLoading(false));
	});
	if (loading) return <Loader />;

	const deleteUser = async () => {
		setLoading(true);
		// const testingEndpoint =
		// 	"http://127.0.0.1:5001/ls-ops-map/us-central1/api/users";
		const productionEndpoint =
			"https://us-central1-ls-ops-map.cloudfunctions.net/api/users ";
		const response = await fetch(productionEndpoint, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${currentUser.accessToken}`,
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({ uid: selected.id }),
		});
		if (response.status === 204) {
			console.log("User successfully deleted");
			setUsers((prev) => prev.filter((user) => user.id !== selected.id));
			setSelected(null);
		}
		setLoading(false);
	};

	const createUser = async (username, password) => {
		setLoading(true);
		const testingEndpoint =
			"http://127.0.0.1:5001/ls-ops-map/us-central1/api/users";
		const productionEndpoint =
			"https://us-central1-ls-ops-map.cloudfunctions.net/api/users";
		try {
			const response = await fetch(productionEndpoint, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${currentUser.accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});
			if (response.status === 201) {
				console.log("User successfully created!");
				const jsonResponse = await response.json();
				console.log(jsonResponse);
				const { newUserId } = jsonResponse;
				setUsers((prev) => [
					...prev,
					{ id: newUserId, data: { isAdmin: false, name: username } },
				]);
				setSelected({ id: newUserId, name: username, isAdmin: "false" });
				return setLoading(false);
			}
			const error = await response.json();
			console.log(error);
			alert(error.message || error.status);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};
	const adminUser = async (adminStatusBoolean) => {
		setLoading(true);
		try {
			await write("users", selected.id, { isAdmin: adminStatusBoolean });
			setSelected((prev) => ({ ...prev, isAdmin: `${adminStatusBoolean}` }));
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

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
										onClick={() => {
											const isAdminBool = selected.isAdmin === "true";
											adminUser(!isAdminBool);
										}}
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
								<Button
									variant="danger"
									style={{ width: "80%" }}
									onClick={deleteUser}
								>
									Delete User {selected?.name.toUpperCase()}
								</Button>
							</li>
						</>
					) : null}
				</ul>
			</div>
			<Button
				className="m-5"
				onClick={async () => {
					let username = prompt("Username? Must be an @dtvpan.com account");
					const formattedUsername = username.match(/(.+)@/)
						? username.match(/(.+)@/)[1]
						: null;
					if (formattedUsername) username = formattedUsername;
					const password = prompt(
						"Password? This is the only time you will be able to see it, take note."
					);
					createUser(username, password);
				}}
			>
				Create New User
			</Button>
		</div>
	);
}
