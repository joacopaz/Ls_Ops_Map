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
				if (indexToChange === -1 && change.type === "Create") {
					// prevent new channels from being created with prevState
					if (change.prevState) delete change.prevState;
					channels.push({ id, data: change });
					indexToChange = channels.length - 1;
				}
				const newProps = {};
				let deletedChannel;
				if (change.type === "Delete") {
					deletedChannel = channels.splice(indexToChange, 1);
				} else {
					for (const key in change) {
						if (Object.hasOwnProperty.call(change, key)) {
							const element = change[key];
							if (
								key === "channel" ||
								key === "id" ||
								key === "type" ||
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
				}
				if (change.type === "Create")
					console.log(
						`Creating VC ${channels[indexToChange]?.data?.vc} ${
							channels[indexToChange]?.data?.canal
						} with ${JSON.stringify(newProps)}`
					);
				if (change.type === "Delete")
					console.log(
						`Deleting VC ${deletedChannel[0]?.data.vc} ${deletedChannel[0]?.data.canal}`
					);
				if (!change.type)
					console.log(
						`Updating VC ${channels[indexToChange]?.data?.vc} ${
							channels[indexToChange]?.data?.canal
						} with ${JSON.stringify(newProps)}`
					);
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
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (!currentUser) return;
		const hasStorage = Object.keys(storage.getAll()).length !== 0;
		if (hasStorage && !fetched.current) {
			setLoading(true);
			fetched.current = true;
			const compareVersions = async () => {
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
				if (latestStoragedVersion < current) {
					await checkPatch();
					setLoading(false);
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
					setLoading(false);
				}
			};
			try {
				compareVersions();
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
				channels.sort((a, b) => Number(a.data.vc) > Number(b.data.vc));
				setData({ version: current, channels });
				storage.set("channels", JSON.stringify(channels));
				storage.set("version", JSON.stringify(current));
				console.log(`Updated local storage to version ${current} of DB`);
				setLoading(false);
			};
			try {
				getRemoteDB();
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
	};
};

export default useOnLoad;
