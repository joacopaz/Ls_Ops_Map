import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import useRead from "./useRead";
import storage from "./useStorage";

const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

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
	if (property === "proveedor") stringToShow = "proveedor";
	return stringToShow;
};

const useOnLoad = () => {
	const { currentUser } = useAuth();
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);
	const { read, readAll } = useRead();
	const [columns, setColumns] = useState(
		JSON.parse(localStorage.getItem("columns"))
	);

	const fetched = useRef(null); // to avoid multiple renders, especially during testing (React Strict Mode)
	const handleVersionMismatch = () => {
		localStorage.clear();
		alert("Hay una nueva versión de la base, recargando página");
		window.location.reload();
	};
	const checkPatch = async () => {
		let latestStoragedVersion = round(Number(storage.get("version"))); // localStorage version
		const response = await read("history", "current"); // remoteDB version
		let current;
		if (response) current = response.current;
		if (!response) {
			const useOffline = window.confirm(
				"Hubo un problema accediendo a la base (probablemente con tu conexión). ¿Querés usarla offline? Tené en cuenta que si hubo actualizaciones no las recibirás. Confirmá para usarla offline, de lo contrario se recargará la página para intentar resolverlo."
			);
			if (!useOffline) return window.location.reload();
			current = round(latestStoragedVersion);
		}
		if (latestStoragedVersion < current)
			console.log(
				`Current online version is ${current}, local version is ${latestStoragedVersion}. Running patch`
			);
		while (latestStoragedVersion < current) {
			const data = storage.getAll();
			const version = round(Number(JSON.parse(data.version)));
			const channels = JSON.parse(data.channels);

			const { changes } = await read("history", `v${version}`);
			if (!changes) return handleVersionMismatch();
			changes.forEach((change) => {
				const { id } = change;
				let indexToChange = channels.findIndex((e) => e.id === id);
				let deletedChannel;
				const newProps = {};
				switch (change.actionType) {
					case "Delete Column":
						channels.forEach((channel) => {
							delete channel.data[change.columnName];
						});
						console.log(
							`Deleting all data for column ${change.columnName} in all channels`
						);
						break;
					case "Delete":
						deletedChannel = channels.splice(indexToChange, 1);
						console.log(
							`Deleting VC ${deletedChannel[0]?.data.vc} ${deletedChannel[0]?.data.canal}`
						);
						break;
					case "Create":
						// prevent new channels from being created with prevState
						if (change.prevState) delete change.prevState;
						channels.push({ id, data: change });
						indexToChange = channels.length - 1;
						channels[indexToChange].data = {
							...channels[indexToChange].data,
							...newProps,
						};
						console.log(
							`Creating VC ${channels[indexToChange]?.data?.vc} ${
								channels[indexToChange]?.data?.canal
							} with ${JSON.stringify(newProps)}`
						);
						break;
					case "Create Column":
						channels.forEach((channel) => {
							channel.data[change.columnName] = "-";
						});
						break;
					default:
						for (const key in change) {
							if (Object.hasOwnProperty.call(change, key)) {
								const element = change[key];
								if (
									key === "channel" ||
									key === "id" ||
									key === "actionType" ||
									key === "prevState"
								)
									continue;
								newProps[key] = element;
							}
						}
						channels[indexToChange].data = {
							...channels[indexToChange].data,
							...newProps,
						};
						console.log(
							`Updating VC ${channels[indexToChange]?.data?.vc} ${
								channels[indexToChange]?.data?.canal
							} with ${JSON.stringify(newProps)}`
						);
						break;
				}
			});
			latestStoragedVersion = round(version + 0.01);
			storage.set("version", JSON.stringify(latestStoragedVersion));
			storage.set("channels", JSON.stringify(channels));
			console.log(
				`Finished updating local DB to version ${latestStoragedVersion}`
			);
			channels.sort((a, b) => Number(a.data.vc) > Number(b.data.vc));
			setData({ version: latestStoragedVersion, channels });
		}
		console.log("No further patching needed.");
		return latestStoragedVersion;
	};

	const getCols = async () => {
		// if (fetched.current) return;
		try {
			// Checking local storage for current version and making it a number
			let parsedLocalVersion;
			const localVersion = localStorage.getItem("colVersion");
			if (localVersion)
				parsedLocalVersion = Number(localStorage.getItem("colVersion"));
			// Getting online version
			const { current } = await read("columns", "current");
			const onlineVersion = current;

			// If equal use local
			if (parsedLocalVersion === onlineVersion && localVersion) {
				console.log("Using local columns");
				return setColumns(JSON.parse(localStorage.getItem("columns")));
			}

			// If not equal download new version
			console.log("Downloading online columns");
			localStorage.setItem("colVersion", `${onlineVersion}`);
			const unfilteredCols = await readAll("columns");
			const allColumns = unfilteredCols.filter((col) => col.id !== "current");
			localStorage.setItem("columns", JSON.stringify(allColumns));
			return setColumns(JSON.parse(localStorage.getItem("columns")));
		} catch (error) {
			alert(
				`There was an error, please report this bug as "Error fetching columns, in useColumns Line 37"`
			);
			window.location.reload();
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (!currentUser) return;
		const hasStorage = Object.keys(storage.getAll()).length > 1;
		if (hasStorage && !fetched.current) {
			setLoading(true);
			fetched.current = true;
			const compareVersions = async () => {
				let latestStoragedVersion = round(Number(storage.get("version"))); // localStorage version
				const response = await read("history", "current"); // remoteDB version
				const lastRemoteForcedUpdate = response.forcedUpdate;
				const lastLocalForcedUpdate = Number(storage.get("forcedUpdate"));
				if (
					!lastLocalForcedUpdate ||
					lastRemoteForcedUpdate > lastLocalForcedUpdate
				) {
					storage.clear();
					storage.set("forcedUpdate", JSON.stringify(Date.now()));
					window.location.reload();
				}
				let current;
				if (response) current = response.current;
				if (!response) {
					const useOffline = window.confirm(
						"Hubo un problema accediendo a la base (probablemente con tu conexión). ¿Querés usarla offline? Tené en cuenta que si hubo actualizaciones no las recibirás. Confirmá para usarla offline, de lo contrario se recargará la página para intentar resolverlo."
					);
					if (!useOffline) return window.location.reload();
					current = round(latestStoragedVersion);
				}
				if (latestStoragedVersion < current) {
					await checkPatch();
				} else {
					const data = storage.getAll();
					const version = round(Number(current));
					if (latestStoragedVersion > current) {
						handleVersionMismatch();
					}
					const channels = JSON.parse(data.channels);
					channels.sort((a, b) => Number(a.data.vc) > Number(b.data.vc));
					setData({ version, channels });
					console.log("Parsed local data");
				}
			};
			try {
				compareVersions()
					.then(async () => await getCols())
					.then(() => setLoading(false));
			} catch (error) {
				console.log(error);
			}
		} else if (!hasStorage && !fetched.current) {
			const getRemoteDB = async () => {
				setLoading(true);
				fetched.current = true;
				console.log("Fetching remote data");
				const channels = await readAll("channels");
				const { current } = await read("history", "current"); // remoteDB version
				channels.sort((a, b) => Number(a.data.vc) - Number(b.data.vc));
				setData({ version: current, channels });
				storage.set("channels", JSON.stringify(channels));
				storage.set("version", JSON.stringify(current));
				storage.set("forcedUpdate", Date.now());
				console.log(`Updated local storage to version ${current} of DB`);
			};
			try {
				getRemoteDB()
					.then(async () => await getCols())
					.then(() => setLoading(false));
			} catch (error) {
				console.log(error);
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	return {
		data,
		loading,
		setData,
		setLoading,
		round,
		propertyToString,
		checkPatch,
		getCols,
		columns,
	};
};

export default useOnLoad;
