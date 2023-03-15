import React, { useState, useRef } from "react";
import { ListGroup, Card, Button, Alert, Modal, Form } from "react-bootstrap";
import styles from "../Mapa.module.css";
import DBColumn from "./DBColumn";
import Loader from "./Loader";
import useWrite from "../hooks/useWrite";
import useRead from "../hooks/useRead";
import { useAuth } from "../contexts/AuthContext";

export default function ManageDB({ checkCols, checkPatch, round }) {
	const { write, delField, del } = useWrite();
	const { read } = useRead();
	const [modal1, setModal1] = useState(0);
	const [modal2, setModal2] = useState(0);
	const { currentUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const [loadingMsg, setLoadingMsg] = useState(null);
	const [selected, setSelected] = useState(undefined);
	const [showModal, setShowModal] = useState({ show: false, edit: null });
	const modalInputRef = useRef(null);
	const secondModalInputRef = useRef(null);
	const submitRef = useRef(null);
	const columns = (() => {
		const columnsObject = {};
		columnsObject.version = JSON.parse(localStorage.getItem("colVersion"));
		columnsObject.data = JSON.parse(localStorage.getItem("columns")).map(
			(col) => col.data
		);
		return columnsObject;
	})();
	const sortedColumns = columns.data.sort(
		(colA, colB) => colA.order - colB.order
	);
	const toggleFitSize = async () => {
		setLoading(true);
		setLoadingMsg("Toggling size...");
		try {
			const { current } = await read("columns", "current");
			await write("columns", selected.column, {
				isLong: !selected.isLong,
			});
			await write("columns", "current", { current: current + 1 });
			checkCols();
			setSelected((prev) => ({ ...prev, isLong: !prev.isLong }));
		} catch (error) {
			alert(JSON.stringify(error));
			setLoading(false);
		}
		setLoading(false);
	};

	const toggleHidden = async () => {
		setLoading(true);
		setLoadingMsg("Toggling hidden...");
		const isHidden = selected.hidden ? true : false;
		try {
			const { current } = await read("columns", "current");
			await write("columns", selected.column, {
				hidden: !isHidden,
			});
			await write("columns", "current", { current: current + 1 });
			checkCols();
			setSelected((prev) => ({ ...prev, hidden: !isHidden }));
		} catch (error) {
			alert(JSON.stringify(error));
			setLoading(false);
		}
		setLoading(false);
	};

	const changeColumnTitle = async () => {
		setLoading(true);
		setLoadingMsg("Changing column title...");
		const value = modalInputRef.current.value;
		if (value === selected.title) {
			setLoading(false);
			return setShowModal({ show: false, edit: null });
		}
		setShowModal({ show: false, edit: null });
		try {
			const { current } = await read("columns", "current");
			await write("columns", selected.column, {
				title: value,
			});
			await write("columns", "current", { current: current + 1 });
			checkCols();
			setSelected((prev) => ({ ...prev, title: value }));
		} catch (error) {
			alert(JSON.stringify(error));
			setLoading(false);
		}
		setLoading(false);
	};

	const changeExcelTitle = async () => {
		setLoading(true);
		setLoadingMsg("Changing excel title...");
		const value = modalInputRef.current.value;
		if (value === selected.oldKey) {
			setLoading(false);
			return setShowModal({ show: false, edit: null });
		}
		setShowModal({ show: false, edit: null });
		try {
			const { current } = await read("columns", "current");
			await write("columns", selected.column, {
				oldKey: value,
			});
			await write("columns", "current", { current: current + 1 });
			checkCols();
			setSelected((prev) => ({ ...prev, oldKey: value }));
		} catch (error) {
			alert(JSON.stringify(error));
			setLoading(false);
		}
		setLoading(false);
	};

	const changeOrder = async () => {
		setLoading(true);
		setLoadingMsg("Changing order...");
		const value = Number(modalInputRef.current.value);
		if (!value || value > columns.data.length || value < 1) {
			setLoading(false);
			return alert(
				`Value must be a number between 1 and ${columns.data.length}`
			);
		}
		setShowModal({ show: false, edit: null });
		if (value === selected.order) {
			return setLoading(false);
		}

		// Index of our current column
		const currentIndex = selected.order - 1;
		// The index of the column that has the order we want
		const indexToChange = value - 1;
		// Shallow copy of new column object we will write
		const newColumns = [...columns.data];

		if (value > selected.order) {
			newColumns.splice(indexToChange + 1, 0, { ...selected, order: value });
			newColumns.splice(currentIndex, 1);
		}
		if (value < selected.order) {
			newColumns.splice(indexToChange, 0, { ...selected, order: value });
			newColumns.splice(currentIndex + 1, 1);
		}
		const newFinalColumns = newColumns.map((col, i) => ({
			...col,
			order: i + 1,
		}));
		const elementsToUpdate = [];
		newFinalColumns.forEach((col) => {
			const prevElement = columns.data.find((e) => e.column === col.column);
			if (prevElement.order !== col.order) elementsToUpdate.push(col);
		});
		try {
			for (let i = 0; i < elementsToUpdate.length; i++) {
				const element = elementsToUpdate[i];
				setLoadingMsg(
					`Updating ${element.title} to new position ${element.order}`
				);
				await write("columns", element.column, { order: element.order });
			}
			setLoadingMsg("Updating columns for other users...");
			const { current } = await read("columns", "current");
			await write("columns", "current", { current: current + 1 });
			checkCols();
			setSelected((prev) => ({ ...prev, order: value }));
		} catch (error) {
			alert(JSON.stringify(error));
			setLoading(false);
		}
		setLoading(false);
	};

	const deleteColumnFirstStep = async () => {
		const confirm = window.confirm(
			"Are you sure you want to delete this column? This will delete all the column data for each and every channel, this action cannot be undone. Be advised you should probably backup the DB (via Excel or Google Sheets) just in case you need the info"
		);
		if (!confirm) return;
		setShowModal({ show: true, edit: "Delete Column" });
	};
	const deleteColumnSecondStep = async () => {
		const input = modalInputRef.current.value;
		if (input !== `Delete ${selected.title} Column`) {
			setShowModal({ show: false, edit: null });
			return alert("Deletion canceled, input did not match");
		}
		setLoading(true);
		setShowModal({ show: false, edit: null });

		// Pre patch to get latest channel version
		setLoadingMsg("Patching DB...");
		await checkPatch();
		const selected = {};

		const channels = JSON.parse(localStorage.getItem("channels"));
		try {
			setLoadingMsg(`Deleting ${selected.title} from Columns DB`);

			// Deleting col in each updated channel
			for (let i = 0; i < channels.length; i++) {
				const element = channels[i];
				setLoadingMsg(
					`Deleting column in all channels, this may take a while: ${Math.floor(
						(i / channels.length) * 100
					)}%`
				);
				delete element.data[selected.column];
				try {
					await delField("channels", element.id, selected.column);
				} catch (error) {
					console.log(error);
				}
			}

			// Delete column in columns DB
			setLoadingMsg("Deleting column in columns DB...");
			await del("columns", selected.column);

			setLoadingMsg("Patching...");
			await checkPatch();

			setLoadingMsg("Writing to history for other users...");
			let latestStoragedVersion = round(
				Number(localStorage.getItem("version"))
			); // localStorage version
			const response = await read("history", "current"); // remoteDB version
			let current;
			if (response) current = round(Number(response.current));
			if (!response) {
				console.log(`Error fetching latest version, falling back on cache`);
				current = latestStoragedVersion;
			}
			if (round(Number(latestStoragedVersion)) === round(Number(current))) {
				setLoadingMsg("Uploading changes...");
				const newVersion = round(Number(latestStoragedVersion) + 0.01);
				const change = {
					changes: [
						{
							actionType: "Delete Column",
							columnName: selected.column,
						},
					],
					user: currentUser.username,
					timestamp: `${new Date()}`,
				};
				const history = await read("columns", "current");
				await write("columns", "current", { current: history.current + 1 });

				await write("history", `v${current}`, change);
				await write("history", "current", {
					current: newVersion,
					created: `${new Date()}`,
					user: currentUser.username,
				});

				setLoadingMsg("Parsing new columns...");
				setSelected(undefined);
				await checkPatch();
				await checkCols();
				return setLoading(false);
			}
			alert(
				"There was an error running the operation! Please check if the DB has not been updated while this operation was being executed."
			);
		} catch (error) {
			console.log(error);
			setLoading(false);
			alert(JSON.stringify(error));
		}
		setLoading(false);
	};

	const createColumn = async () => {
		// Preemptive value checking
		const newColTitle = modalInputRef.current.value;
		const newColMapData = secondModalInputRef.current.value;
		if (!newColTitle || !newColMapData)
			return alert("Title or Map Data cannot be empty!");
		if (newColMapData.match(/\s/)) {
			return alert("There cannot be spaces in map data");
		}
		if (newColTitle.length > 25 || newColMapData.length > 15)
			return alert("Title must be max 25 chars long and Map Data max 15");
		if (newColMapData[0] === newColMapData[0].toUpperCase())
			return alert("Map Data cannot start with uppercase!");
		setLoading(true);
		setLoadingMsg("Creating new column...");
		setShowModal({ show: false, edit: null });
		// Handle updating columns collection
		try {
			await checkPatch();

			// Handle updating channels DB
			setLoadingMsg(
				"Updating all channels with that column (this may take a while)..."
			);
			const channels = JSON.parse(localStorage.getItem("channels"));
			for (let i = 0; i < channels.length; i++) {
				const channel = channels[i];
				setLoadingMsg(
					`Updating all channels with new column (this may take a while)... ${Math.floor(
						(i / channels.length) * 100
					)}%`
				);
				await write("channels", `${channel.id}`, { [newColMapData]: "-" });
			}
			let latestStoragedVersion = round(
				Number(localStorage.getItem("version"))
			); // localStorage version
			const response = await read("history", "current"); // remoteDB version
			let currentV;
			if (response) currentV = round(Number(response.current));
			if (!response) {
				console.log(`Error fetching latest version, falling back on cache`);
				currentV = latestStoragedVersion;
			}
			if (round(Number(latestStoragedVersion)) === round(Number(currentV))) {
				setLoadingMsg("Uploading changes...");
				const newVersion = round(Number(latestStoragedVersion) + 0.01);
				const change = {
					changes: [
						{
							actionType: "Create Column",
							columnName: newColMapData,
						},
					],
					user: currentUser.username,
					timestamp: `${new Date()}`,
				};
				await write("history", `v${currentV}`, change);
				await write("history", "current", {
					current: newVersion,
					created: `${new Date()}`,
					user: currentUser.username,
				});
				await write("columns", newColMapData, {
					column: newColMapData,
					title: newColTitle,
					isLong: false,
					oldKey: newColTitle.toUpperCase(),
					order: columns.data.length + 1,
				});
				const { current } = await read("columns", "current");
				await write("columns", "current", { current: current + 1 });
				await checkPatch();
				await checkCols();
				setSelected({
					column: newColMapData,
					title: newColTitle,
					isLong: false,
					oldKey: newColTitle.toUpperCase(),
					order: columns.data.length + 1,
				});
				setLoading(false);
			}
			alert(
				"Error uploading data, please verify what information has changed before re-creating anything"
			);
		} catch (error) {
			console.log(error);
			alert("Error, check console for details (F12)");
			setLoading(false);
		}
		setLoading(false);
	};

	return (
		<div
			className={`${styles.scriptEnvContainer} ${styles.mapa} ${styles.manageUsersContainer} ${styles.manageDBContainer}`}
		>
			{/* Modal to edit */}
			{showModal.show ? (
				<Modal
					size="lg"
					show={showModal.show}
					onHide={() => setShowModal({ show: false, edit: null })}
					style={{ color: "black" }}
					onEscapeKeyDown={() => setShowModal({ show: false, edit: null })}
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							{showModal.edit === "Delete Column"
								? `You are about to delete the ${selected.title} column!`
								: showModal.edit === "Create Column"
								? `New Column Values`
								: `New ${showModal.edit} Value`}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form
							onSubmit={(e) => {
								e.preventDefault();
								submitRef.current.click();
							}}
						>
							<Form.Label>
								{showModal.edit === "Delete Column"
									? "Security Check"
									: showModal.edit === "Create Column"
									? "New Column Title"
									: showModal.edit}
							</Form.Label>
							<Form.Control
								type="text"
								style={{ width: "300px" }}
								ref={modalInputRef}
								defaultValue={
									showModal.edit === "Visible Name"
										? selected?.title
										: showModal.edit === "Excel Name"
										? selected?.oldKey
										: showModal.edit === "Order"
										? selected?.order
										: ""
								}
								placeholder={
									showModal.edit === "Delete Column"
										? `Delete ${selected.title} Column`
										: showModal.edit === "Create Column"
										? "New column title"
										: null
								}
								onChange={(e) => {
									if (showModal.edit === "Create Column")
										setModal1(e.target.value.length);
								}}
								onKeyDown={(e) => {
									if (e.code === "Enter") submitRef.current.click();
								}}
							/>
							<Form.Text muted>
								{showModal.edit !== "Delete Column" ? (
									showModal.edit === "Order" ? (
										`Only numbers between 1 and ${columns.data.length}`
									) : showModal.edit === "Create Column" ? (
										<span>
											Do not use symbols nor : at the end, maximum{" "}
											<span
												style={
													modal1 > 25 ? { color: "red" } : { color: "green" }
												}
											>
												{25 - modal1}
											</span>{" "}
											characters left
										</span>
									) : (
										"Do not use symbols"
									)
								) : (
									`To confirm deletion type Delete ${selected.title} Column`
								)}
							</Form.Text>
							{showModal.edit === "Create Column" ? (
								<>
									<br />
									<Form.Label className="mt-4">
										New Column Mapped Name{" "}
										<span style={{ color: "red" }}>(Cannot be changed)</span>
									</Form.Label>
									<Form.Control
										type="text"
										style={{ width: "300px" }}
										ref={secondModalInputRef}
										placeholder={"New column mapped name"}
										onChange={(e) => {
											if (showModal.edit === "Create Column")
												setModal2(e.target.value.length);
										}}
									/>
									<Form.Text muted>
										Must start with lowercase, cannot have spaces and max{" "}
										<span
											style={
												modal2 > 15 ? { color: "red" } : { color: "green" }
											}
										>
											{15 - modal2}
										</span>{" "}
										chars left. {<br />}For Example: if the column title is
										Datos Proveedor mapped name could be datosProv
									</Form.Text>
								</>
							) : null}
						</Form>
					</Modal.Body>
					<Modal.Footer>
						{showModal.edit === "Delete Column" ? (
							<Alert variant="danger" className="w-100 text-center m-2">
								This will delete forever all data for this column in every
								channel, this cannot be undone.
							</Alert>
						) : null}
						<Button
							ref={submitRef}
							disabled={loading}
							variant="success"
							onClick={() => {
								switch (showModal.edit) {
									case "Visible Name":
										changeColumnTitle();
										break;
									case "Excel Name":
										changeExcelTitle();
										break;
									case "Order":
										changeOrder();
										break;
									case "Delete Column":
										deleteColumnSecondStep();
										break;
									case "Create Column":
										createColumn();
										break;
									default:
								}
							}}
						>
							Submit
						</Button>
						<Button
							variant="danger"
							disabled={loading}
							onClick={() => setShowModal({ show: false, edit: null })}
						>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
			) : null}
			{/* End modal */}
			{loading ? <Loader message={loadingMsg} /> : null}
			<h2 className="mb-4">Manage Database</h2>
			<div className={styles.manageDBDashboard}>
				<div>
					<h5 style={{ textAlign: "center" }}>Columns</h5>
					<div className={styles.flexColumnsContainerGroup}>
						<ListGroup as="ul" className={styles.columnsContainer}>
							{sortedColumns.map((column, i) => {
								if (i <= (columns.data.length - 1) / 2)
									return (
										<DBColumn
											column={column}
											selected={selected?.title === column.title}
											setSelected={setSelected}
											key={i}
										/>
									);
								return null;
							})}
						</ListGroup>
						<ListGroup as="ul" className={styles.columnsContainer}>
							{sortedColumns.map((column, i) => {
								if (i > (columns.data.length - 1) / 2)
									return (
										<DBColumn
											column={column}
											selected={selected?.title === column.title}
											setSelected={setSelected}
											key={i}
										/>
									);
								return null;
							})}
						</ListGroup>
					</div>
				</div>

				<div
					id="col-data"
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						paddingBottom: "2.5rem",
					}}
				>
					<h5 style={{ textAlign: "center" }}>Column Data</h5>
					<Card className={styles.DBControllersBody}>
						<div>
							<div className={styles.columnDataHeader}>
								<h6>{selected ? `Visible Name:` : "Select a column"}</h6>
								<span>{selected ? selected.title : ""}</span>
							</div>
							{selected ? (
								<Button
									variant="primary"
									disabled={loading}
									onClick={() => {
										setShowModal({ show: true, edit: "Visible Name" });
									}}
								>
									Edit Visible Name
								</Button>
							) : null}
						</div>
						{selected ? (
							<>
								<div>
									<div className={styles.columnDataHeader}>
										<h6>Mapped As:</h6>
										<span>{selected ? selected.column : ""}</span>
									</div>
									<Alert
										variant="danger"
										style={{ marginBottom: "0", padding: "0.5rem" }}
									>
										Can't edit mapped data
									</Alert>
								</div>
								<div>
									<div className={styles.columnDataHeader}>
										<h6>Excel Name:</h6>
										<span>{selected ? selected.oldKey : ""}</span>
									</div>
									<Button
										variant="primary"
										disabled={loading}
										onClick={() =>
											setShowModal({ show: true, edit: "Excel Name" })
										}
									>
										Edit Excel Name
									</Button>
								</div>
								<div>
									<div className={styles.columnDataHeader}>
										<h6>Fit-size:</h6>
										<span>
											{selected ? (selected.isLong ? "Long" : "Short") : ""}
										</span>
									</div>
									<Button
										variant="primary"
										onClick={toggleFitSize}
										disabled={loading}
									>
										Toggle Fit-Size
									</Button>
								</div>

								<div>
									<div className={styles.columnDataHeader}>
										<h6>Order:</h6>
										<span>{selected ? selected.order : ""}</span>
									</div>
									<Button
										variant="primary"
										disabled={loading}
										onClick={() => setShowModal({ show: true, edit: "Order" })}
									>
										Edit Order
									</Button>
								</div>
								<div>
									<div className={styles.columnDataHeader}>
										<h6>Hidden:</h6>
										<span
											style={
												selected.hidden
													? { color: "green", fontWeight: "bold" }
													: { color: "red", fontWeight: "bold" }
											}
										>
											{selected ? (selected.hidden ? "TRUE" : "FALSE") : ""}
										</span>
									</div>
									<Button
										variant="primary"
										disabled={loading}
										onClick={toggleHidden}
									>
										Toggle Hidden
									</Button>
								</div>
								<Button
									variant="danger"
									className="mt-2 w-100"
									disabled={loading}
									onClick={deleteColumnFirstStep}
								>
									Delete {selected.title} column
								</Button>
							</>
						) : null}
					</Card>
				</div>
			</div>
			<Button
				variant="success"
				className="mb-3"
				onClick={() => setShowModal({ show: true, edit: "Create Column" })}
			>
				Create New Column
			</Button>
		</div>
	);
}
