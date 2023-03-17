import styles from "../Mapa.module.css";
import { useEffect, useRef, useState } from "react";
import EditModal from "./EditModal";
import Searchbar from "./Searchbar";
import ChannelData from "./ChannelData";
import ConfirmModal from "./ConfirmModal";
import useRead from "../hooks/useRead";
import useWrite from "../hooks/useWrite";
import storage from "../hooks/useStorage";
import { useAuth } from "../contexts/AuthContext";
import DeleteForm from "./DeleteForm";
import MapButtons from "./MapButtons";
import Filter from "./Filter";
import FilterBar from "./Filterbar";
import FilterForm from "./FilterForm";

const Mapa = ({
	data,
	loading,
	setData,
	setLoading,
	round,
	propertyToString,
	checkPatch,
	columns,
}) => {
	const { read } = useRead();
	const { write, del } = useWrite();
	const { currentUser } = useAuth();
	const searchRef = useRef();
	const deleteInputRef = useRef();
	const contentRef = useRef();
	const [selectedChannel, setSelectedChannel] = useState(null);
	const [sharedVcs, setSharedVcs] = useState([]);
	const [edit, setEdit] = useState(false);
	const [show, setShow] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [editPayload, setEditPayload] = useState([]);
	const [editCache, setEditCache] = useState([]);
	const [property, setProperty] = useState({});
	const [creatingNew, setCreatingNew] = useState(false);
	const [alert, setAlert] = useState("");
	const [deleting, setDeleting] = useState(false);
	const [channelToDelete, setChannelToDelete] = useState({});
	const [deleteConfirm, setDeleteConfirm] = useState(false);
	const [searching, setSearching] = useState(false);

	useEffect(() => {
		// Set first channel as selected on load
		if (
			Object.keys(data).length > 0 &&
			!selectedChannel &&
			!data.channels[0].type
		) {
			setSelectedChannel(data.channels[0]);
		}
		// Force re-assignment of channels every time data changes, to fix edits not rendering when editing same channel twice
		if (Object.keys(data).length > 0 && selectedChannel)
			setSelectedChannel(
				data.channels[
					data.channels.findIndex((ch) => ch.id === selectedChannel.id)
				]
			);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);
	useEffect(() => {
		if (editPayload.length > 0) {
			// console.log(editPayload); // debug
			// update UI to see changes
			const newData = { ...data };
			editPayload.forEach((edit) => {
				let indexOfChange = newData.channels.findIndex((e) => edit.id === e.id);
				if (indexOfChange === -1 && creatingNew) {
					// update local data with new channel
					newData.channels.push(selectedChannel);
					indexOfChange = newData.channels.length - 1;
				} else if (indexOfChange === -1) {
					return;
				}
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
		if (!selectedChannel) return;
		if (deleting) return;
		const vc = selectedChannel.data.vc;
		const compartidos = data.channels.filter((e) => e.data.vc === vc);
		if (compartidos.length === 1) setSharedVcs([]);
		if (compartidos.length > 1) {
			setSharedVcs(compartidos);
		}
	}, [selectedChannel, data.channels, deleting]);
	useEffect(() => {
		if (!creatingNew) cancelEditingMode();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedChannel]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (searchRef.current.value === "Create new channel") {
			return;
		}
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
	const finishEditing = (e) => {
		if (editPayload.length === 0) {
			setEdit(false);
			setShowConfirm(false);
			return;
		}
		if (alert) setAlert("");
		if (
			selectedChannel.data.vc === "TBD" ||
			selectedChannel.data.canal === "New channel"
		)
			setAlert(`VC and channel name must be assigned a new value on channel creation
			(can be modified later).`);
		if (
			data.channels.find(
				(e) =>
					e.data.canal.toLowerCase() ===
						selectedChannel.data.canal.toLowerCase() &&
					e.id !== selectedChannel.id
			)
		)
			setAlert(
				`Channel name must be unique, ${
					selectedChannel.data.canal
				} is currently in use by VC ${
					data.channels.find(
						(e) =>
							e.data.canal.toLowerCase() ===
								selectedChannel.data.canal.toLowerCase() &&
							e.id !== selectedChannel.id
					).data.vc
				}.`
			);
		if (isNaN(selectedChannel.data.vc)) setAlert("VC must be a number");
		let string = "";
		editPayload.forEach((e) => {
			const channel = editCache.find((channel) => e.id === channel.id);
			string += `<div><span>VC ${
				channel.data.vc
			} ${channel.data.canal.toUpperCase()}</span><br>`;
			for (const key in e.changes) {
				if (Object.hasOwnProperty.call(e.changes, key)) {
					if (key === "prevState") continue;
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
		if (!deleting)
			editCache.forEach((e) => {
				if (e.actionType === "Create") {
					const indexToDelete = indexOfChannel(e.id);
					data.channels.splice(indexToDelete, 1);
				} else {
					const indexToRestore = dataToRestore.channels.findIndex(
						(channel) => channel.id === e.id
					);
					dataToRestore.channels[indexToRestore].data = e.data;
				}
			});
		if (!deleting) setData(dataToRestore);
		setEdit(false);
		setEditCache([]);
		setEditPayload([]);
		if (creatingNew) {
			setCreatingNew(false);
			setSelectedChannel(data.channels[0]);
		}
		if (deleting) setDeleting(false);
	};
	const editData = (property) => {
		const stringToShow = propertyToString(property);
		setProperty({ property, stringToShow });
		setShow(true);
	};
	const indexOfChannel = (id) => {
		return data.channels.findIndex((e) => e.id === id);
	};
	const handleChannelCreation = async () => {
		setDeleting(false);
		setLoading(true);
		await checkPatch();
		const lastID = data.channels.reduce((acc, curr) => {
			if (Number(curr.id) > acc) acc = Number(curr.id);
			return acc;
		}, 0);
		const newID = lastID + 1; // newID to create
		const newChannel = {
			id: `${newID}`,
			data: {
				GMT: "-",
				GMTverano: "-",
				actionPack: "-",
				analista: "-",
				canal: "New channel",
				carga: "-",
				categoria: "-",
				contacto: "-",
				correo: "-",
				engDesc: "-",
				esclavo: "-",
				espejos: "-",
				frecuencia: "-",
				grid: "-",
				horario: "-",
				img: "-",
				master: "-",
				obs: "-",
				pass: "-",
				spaDesc: "-",
				tel: "-",
				territorio: "-",
				url: "-",
				usuario: "-",
				vc: "TBD",
				proveedor: "-",
				type: "-",
				sid: "-",
			},
		};
		setCreatingNew(true);
		setEdit(true);
		setSelectedChannel(newChannel);
		setEditPayload([
			...editPayload,
			{
				id: `${newID}`,
				actionType: "Create",
				changes: { ...newChannel.data },
			},
		]);
		setEditCache((prev) => [
			...prev,
			{ id: `${newID}`, actionType: "Create", data: { ...newChannel.data } },
		]);
		setLoading(false);
	};
	const handleChannelDeletion = () => {
		if (deleting === false) setDeleting(true);
	};
	const handleConfirm = async (isDelete) => {
		if (editPayload.length === 0) return;
		setLoading(true);
		await checkPatch();
		let latestStoragedVersion = round(Number(storage.get("version"))); // localStorage version
		const response = await read("history", "current"); // remoteDB version
		let current;
		if (response) current = round(Number(response.current));
		if (!response) {
			console.log(`Error fetching latest version, falling back on cache`);
			current = latestStoragedVersion;
		}
		if (round(Number(latestStoragedVersion)) === round(Number(current))) {
			console.log(`Uploading changes...`);
			const newVersion = round(Number(latestStoragedVersion) + 0.01);
			const user = currentUser.email.match(/(.+)@/)[1];
			const changesForHistory = editPayload.map((e) => {
				const channelIndex = indexOfChannel(e.id);
				const channel = data.channels[channelIndex].data.canal;
				if (e.actionType === "Create" && e.changes.prevState)
					delete e.changes.prevState;
				if (e.actionType)
					return {
						channel,
						id: e.id,
						actionType: e.actionType,
						...e.changes,
					};
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
			await write("history", "current", {
				current: newVersion,
				created: timestamp,
				user,
			});
			editPayload.forEach(async (e) => {
				if (e.changes.actionType !== "Delete") {
					if (e.changes.prevState) delete e.changes.prevState;
					return await write("channels", e.id, { ...e.changes });
				}
				await del("channels", e.id);
				console.log("Deleted " + e.id);
			});
			await checkPatch();
		}

		setEdit(false);
		setShowConfirm(false);
		setCreatingNew(false);
		setEditPayload([]);
		setDeleting(false);
		setLoading(false);
		setProperty({});
		setEditCache([]);
		if (isDelete) {
			if (data.channels[0] === channelToDelete) {
				setSelectedChannel(data.channels[1]);
				return setChannelToDelete({});
			}
			setSelectedChannel(data.channels[0]);
			setChannelToDelete({});
		}
	};
	const handleDeleteInput = (e) => {
		const channel = data.channels.find(
			(e) => `${e.data.vc} ${e.data.canal}` === deleteInputRef.current.value
		);
		if (!channel) return;
		setChannelToDelete(channel);
	};
	return (
		<div
			style={loading ? { display: "none" } : { display: "flex" }}
			ref={contentRef}
			className={styles.content}
		>
			{!loading && selectedChannel ? (
				<>
					<ConfirmModal
						showConfirm={showConfirm}
						setShowConfirm={setShowConfirm}
						handleConfirm={handleConfirm}
						alert={alert}
					/>
					<EditModal
						show={show}
						creatingNew={creatingNew}
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
					<div className={`${styles.mapa} ${edit && styles.mapEditing}`}>
						{!creatingNew && !edit ? (
							<>
								<Filter
									setSearching={setSearching}
									searching={searching}
									contentRef={contentRef}
								/>
								{searching ? <FilterBar /> : null}
								{!searching ? (
									<Searchbar
										handleSubmit={handleSubmit}
										setDeleting={setDeleting}
										deleting={deleting}
										handleChannelCreation={handleChannelCreation}
										handleChannelDeletion={handleChannelDeletion}
										setDeleteConfirm={setDeleteConfirm}
										setChannelToDelete={setChannelToDelete}
										setSelectedChannel={setSelectedChannel}
										data={data}
										ref={searchRef}
									/>
								) : null}
							</>
						) : null}
						{!searching ? (
							<>
								{selectedChannel && !deleting && columns?.length > 10 ? (
									<ChannelData
										e={selectedChannel.data}
										edit={edit}
										editData={editData}
										sharedVcs={sharedVcs}
										columns={columns}
									/>
								) : null}
								{deleting ? (
									<DeleteForm
										ref={deleteInputRef}
										handleDeleteInput={handleDeleteInput}
										deleteConfirm={deleteConfirm}
										setDeleteConfirm={setDeleteConfirm}
										channelToDelete={channelToDelete}
										handleWillDelete={handleConfirm}
										setEditPayload={setEditPayload}
										setEdit={setEdit}
										cancelEditingMode={cancelEditingMode}
									/>
								) : null}
								<MapButtons
									selectedChannel={selectedChannel}
									edit={edit}
									deleting={deleting}
									setEdit={setEdit}
									finishEditing={finishEditing}
									cancelEditingMode={cancelEditingMode}
									handleChannelCreation={handleChannelCreation}
									handleChannelDeletion={handleChannelDeletion}
								/>{" "}
							</>
						) : (
							<FilterForm />
						)}
					</div>
				</>
			) : null}
		</div>
	);
};

export default Mapa;
