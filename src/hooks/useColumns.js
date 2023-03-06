import { useEffect, useState } from "react";
import columnsJSON from "../temp/columns.json";

export default function useColumns() {
	const [columns, setColumns] = useState(null);
	useEffect(() => {
		setColumns(columnsJSON.data);
		console.log(columnsJSON.data);
	}, []);
	return { columns };
}
