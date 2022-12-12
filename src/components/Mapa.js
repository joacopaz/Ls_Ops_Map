import styles from "../Mapa.module.css";
import useOnLoad from "../hooks/useOnLoad";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Loader from "./Loader";
// import base from "../base.json";
import EditModal from "./EditModal";
import Searchbar from "./Searchbar";
import ChannelData from "./ChannelData";
import ConfirmModal from "./ConfirmModal";
import useRead from "../hooks/useRead";
import useWrite from "../hooks/useWrite";
import storage from "../hooks/useStorage";
import { useAuth } from "../contexts/AuthContext";

const Mapa = () => {
	const { data, loading, setData, setLoading } = useOnLoad(); // disconnected db to not consume data
	const searchRef = useRef();
	const { read } = useRead();
	const write = useWrite();

	// // DELETE FOR PROD STARTS HERE
	// const mockData = { version: 0, channels: [] };
	// base.forEach((obj, i) => {
	// 	mockData.channels.push({ id: i, data: obj });
	// });
	// const [data, setData] = useState(mockData);
	// const loading = false;
	// // DELETE FOR PROD ENDS HERE

	const [selectedChannel, setSelectedChannel] = useState(() => {
		if (Object.keys(data).length > 0) return data.channels[0];
		return null;
	});
	useEffect(() => {
		if (Object.keys(data).length > 0 && !selectedChannel)
			setSelectedChannel(data.channels[0]);
	}, [data, selectedChannel]);
	const [sharedVcs, setSharedVcs] = useState([]);
	const [edit, setEdit] = useState(false);
	const [show, setShow] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [editPayload, setEditPayload] = useState([]);
	const [editCache, setEditCache] = useState([]);
	const [property, setProperty] = useState({});

	useEffect(() => {
		if (searchRef.current) searchRef.current.focus();
	}, [searchRef]);
	const { currentUser } = useAuth();
	// const handleClick = () => {
	// 	console.log(data);
	// 	// if (selectedChannel) console.log(selectedChannel);
	// };
	const handleChange = (e) => {
		const channel = data.channels.find(
			(e) => `${e.data.vc} ${e.data.canal}` === searchRef.current.value
		);
		if (!channel) return;
		setSelectedChannel(channel);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		// run search function
		const channel = data.channels.find(
			(e) => `${e.data.vc} ${e.data.canal}` === searchRef.current.value
		);
		if (channel) return setSelectedChannel(channel);
		const closestMatch = data.channels.find(
			(e) => searchRef.current.value.match(/(\d+)/)[1] === e.data.vc
		);
		if (closestMatch) setSelectedChannel(closestMatch);
	};

	const enterEditingMode = (e) => {
		setEdit(true);
	};
	const finishEditing = (e) => {
		if (editPayload.length === 0) {
			setEdit(false);
			setShowConfirm(false);
			return;
		}
		let string = "";
		editPayload.forEach((e) => {
			const channel = editCache.find((channel) => e.id === channel.id);
			string += `<div><span>VC ${
				channel.data.vc
			} ${channel.data.canal.toUpperCase()}</span><br>`;
			for (const key in e.changes) {
				if (Object.hasOwnProperty.call(e.changes, key)) {
					const element = e.changes[key];
					const prop = propertyToString(key);
					string += `${prop} &#8594; ${element} <br>`;
				}
			}
			string += `</div>`;
		});
		setShowConfirm({ show: true, value: string });
	};
	const cancelEditingMode = (e) => {
		const dataToRestore = { ...data };
		editCache.forEach((e) => {
			const indexToRestore = dataToRestore.channels.findIndex(
				(channel) => channel.id === e.id
			);
			dataToRestore.channels[indexToRestore].data = e.data;
		});
		setData(dataToRestore);
		setEdit(false);
		setEditCache([]);
		setEditPayload([]);
	};
	const propertyToString = (property) => {
		let stringToShow = property;
		if (property === "img") stringToShow = "logo (URL)";
		if (property === "canal") stringToShow = "nombre";
		if (property === "GMT") stringToShow = "horario GMT";
		if (property === "GMTverano") stringToShow = "horario verano";
		if (property === "actionPack") stringToShow = "action pack";
		if (property === "categoria") stringToShow = "categoría";
		if (property === "pass") stringToShow = "password";
		if (property === "tel") stringToShow = "teléfono";
		if (property === "url") stringToShow = "página web";
		if (property === "vc") stringToShow = "VC";
		if (property === "spaDesc") stringToShow = "descripción (español)";
		if (property === "engDesc") stringToShow = "descripción (inglés)";
		if (property === "obs") stringToShow = "observaciones";
		return stringToShow;
	};
	const editData = (property) => {
		const stringToShow = propertyToString(property);
		setProperty({ property, stringToShow });
		setShow(true);
	};
	const indexOfChannel = (id) => {
		return data.channels.findIndex((e) => e.id === id);
	};
	const handleConfirm = async () => {
		if (editPayload.length === 0) return;
		setLoading(true);
		const latestStoragedVersion = Number(storage.get("version")); // localStorage version
		const data = await read("history", "current"); // remoteDB version
		let current;
		if (data) current = data.current;
		if (!data) {
			console.log(`Error fetching latest version, falling back on cache`);
			current = latestStoragedVersion;
		}
		if (Number(latestStoragedVersion) === Number(current)) {
			console.log(
				`Both versions match, current version is ${current}. Updating DB...`
			);
			const newVersion = Number(latestStoragedVersion) + 0.01;
			const user = currentUser.email.match(/(.+)@/)[1];
			const changesForHistory = editPayload.map((e) => {
				const channelIndex = indexOfChannel(e.id);
				const channel = data.channels[channelIndex].data.canal;
				return {
					channel,
					id: e.id,
					...e.changes,
				};
			});
			const timestamp = `${new Date()}`;
			await write("history", `v${current}`, {
				changes: changesForHistory,
				timestamp,
				user,
			});
			storage.set("version", newVersion);
			storage.set("channels", JSON.stringify(data.channels));
			write("history", "current", {
				current: newVersion,
				created: timestamp,
				user,
			});
			editPayload.forEach(async (e) => {
				await write("channels", e.id, { ...e.changes });
			});

			setEdit(false);
			setShowConfirm(false);
			console.log(`DB updated to v${newVersion}`);
		}
		setLoading(false);
	};
	const e = selectedChannel?.data;

	useEffect(() => {
		if (editPayload.length > 0) {
			// update UI to see changes
			const newData = { ...data };
			editPayload.forEach((edit) => {
				const indexOfChange = newData.channels.findIndex(
					(e) => edit.id === e.id
				);
				for (const key in edit.changes) {
					if (Object.hasOwnProperty.call(edit.changes, key)) {
						const element = edit.changes[key];
						newData.channels[indexOfChange].data = {
							...newData.channels[indexOfChange].data,
							[key]: element,
						};
					}
				}
			});
			setData(newData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editPayload]);

	useEffect(() => {
		if (!e) return;
		const vc = selectedChannel.data.vc;
		const compartidos = data.channels.filter((e) => e.data.vc === vc);
		if (compartidos.length > 1) {
			setSharedVcs(compartidos);
		}
	}, [selectedChannel]);

	return (
		<>
			{loading ? <Loader /> : null}
			{!loading && selectedChannel ? (
				<>
					<ConfirmModal
						showConfirm={showConfirm}
						setShowConfirm={setShowConfirm}
						handleConfirm={handleConfirm}
					/>
					<EditModal
						show={show}
						setShow={setShow}
						property={property}
						selectedChannel={selectedChannel}
						setEditPayload={setEditPayload}
						setEditCache={setEditCache}
						editCache={editCache}
						editPayload={editPayload}
						setData={setData}
						data={data}
					/>
					<div className={styles.mapa}>
						<Searchbar
							handleSubmit={handleSubmit}
							handleChange={handleChange}
							data={data}
							ref={searchRef}
						/>

						{selectedChannel ? (
							<ChannelData
								e={e}
								edit={edit}
								editData={editData}
								sharedVcs={sharedVcs}
							/>
						) : null}

						<div style={{ display: "flex", gap: "20px" }}>
							{selectedChannel && !edit ? (
								<Button
									variant="primary"
									className="mt-4"
									onClick={enterEditingMode}
								>
									Edit
								</Button>
							) : null}
							{selectedChannel && edit ? (
								<Button
									variant="success"
									className="mt-4"
									onClick={finishEditing}
								>
									Submit Changes
								</Button>
							) : null}
							{selectedChannel && edit ? (
								<Button
									variant="danger"
									className="mt-4"
									onClick={cancelEditingMode}
								>
									Cancel
								</Button>
							) : null}
						</div>
						{/* <button onClick={handleClick}>Log All Data</button> */}
					</div>
				</>
			) : null}
		</>
	);
};

export default Mapa;
