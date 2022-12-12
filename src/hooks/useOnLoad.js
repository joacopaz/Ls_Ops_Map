import { useState, useEffect, useRef } from "react";
import useRead from "./useRead";
import storage from "./useStorage";

const useOnLoad = () => {
	const hasStorage = Object.keys(storage.getAll()).length !== 0;
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);
	const { read, readAll } = useRead();
	const fetched = useRef(null); // to avoid multiple renders, especially during testing (React Strict Mode)

	useEffect(() => {
		if (hasStorage && !fetched.current) {
			setLoading(true);
			fetched.current = true;
			const compareVersions = async () => {
				const data = await read("history", "current"); // remoteDB version
				console.log(data);
				let { current } = data;
				let latestStoragedVersion = Number(storage.get("version")); // localStorage version
				if (!current) {
					console.log(`Error fetching latest version, falling back on cache`);
					current = latestStoragedVersion;
				}
				console.log(
					`Current online version is ${current}, local version is ${latestStoragedVersion}`
				);
				if (latestStoragedVersion < current) {
					console.log("Fetching updates for " + latestStoragedVersion);
					while (latestStoragedVersion < current) {
						const data = storage.getAll();
						const version = Number(data.version);
						const channels = JSON.parse(data.channels);
						const { changes } = await read("history", `v${version}`);
						changes.forEach((change) => {
							const { id } = change;
							const indexToChange = channels.findIndex((e) => e.id === id);
							const newProps = {};
							for (const key in change) {
								if (Object.hasOwnProperty.call(change, key)) {
									const element = change[key];
									if (key === "channel" || key === "id") continue;
									newProps[key] = element;
								}
							}
							console.log(
								`Updating VC ${channels[indexToChange].data.vc} ${
									channels[indexToChange].data.canal
								} with ${JSON.stringify(newProps)}`
							);
							channels[indexToChange].data = {
								...channels[indexToChange].data,
								...newProps,
							};
						});
						latestStoragedVersion = version + 0.01;
						storage.set("version", latestStoragedVersion);
						storage.set("channels", JSON.stringify(channels));
						console.log(
							`Finished updating local DB to version ${latestStoragedVersion}`
						);
						setLoading(false);
						setData({ version: latestStoragedVersion, channels });
					}
				} else {
					const data = storage.getAll();
					const version = Number(current);
					if (latestStoragedVersion > current) {
						console.log("Fixing version mismatch");
						storage.set("version", current);
					}

					const channels = JSON.parse(data.channels);
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
				setData({ version: current, channels });
				storage.set("channels", JSON.stringify(channels));
				storage.set("version", current);
				console.log(`Updated local storage to version ${current} of DB`);
				setLoading(false);
			};
			getRemoteDB();
		}
	}, [hasStorage, read, readAll]);

	return { data, loading, setData, setLoading };
};

export default useOnLoad;
