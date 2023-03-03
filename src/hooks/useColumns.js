import { useEffect, useState } from "react";
import useRead from "./useRead";

export default function useColumns() {
	const { readAll } = useRead();
	const [columns, setColumns] = useState(null);
	useEffect(() => {
		const hasStorage = localStorage.getItem("columns");
		if (hasStorage) return setColumns(JSON.parse(hasStorage));
		const getColumns = async () => {
			try {
				const columns = await readAll("columns");
				localStorage.setItem("columns", JSON.stringify(columns));
				setColumns(columns);
			} catch (error) {
				console.log(error);
			}
		};
		getColumns();
	}, [readAll]);
	return { columns };
}
