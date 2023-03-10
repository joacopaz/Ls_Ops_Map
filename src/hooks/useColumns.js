import { useEffect, useState, useRef } from "react";
import useRead from "./useRead";

export default function useColumns() {
	const [columns, setColumns] = useState(
		JSON.parse(localStorage.getItem("columns"))
	);
	const { read, readAll } = useRead();
	const fetched = useRef(false);
	useEffect(() => {
		const getCols = async () => {
			if (fetched.current || columns) return;
			try {
				if (fetched.current) return;
				fetched.current = true;
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
					console.log("Found local columns");
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
		getCols();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { columns };
}
