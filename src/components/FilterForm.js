import React, { useContext, useRef } from "react";
import styles from "../FilterForm.module.css";
import { FilterContext } from "./Dashboard";

export default function FilterForm() {
	const { results } = useContext(FilterContext);

	const alertRef = useRef(null);
	if (!alertRef.current) {
		alert(
			"La sección de búsqueda aún no está programada, igual vas a poder verla!"
		);
		alertRef.current = true;
	}

	return (
		<>
			<h5 className="mt-3">Results</h5>
			{!results ? <div className={styles.results}>No results...</div> : null}
		</>
	);
}
