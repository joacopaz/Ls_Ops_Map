import React, { useContext, useRef } from "react";
import styles from "../FilterForm.module.css";
import { FilterContext } from "./Dashboard";

export default function FilterForm({ setSelectedChannel, setSearching }) {
	const { results, filter } = useContext(FilterContext);

	const handleResultClick = (result) => {
		setSelectedChannel(result);
		setSearching(false);
	};

	const cols = JSON.parse(localStorage.getItem("columns"));
	const getTitle = (col) => {
		return cols.find((column) => column.data.column === col).data.title;
	};

	const alertRef = useRef(null);
	if (!alertRef.current) {
		// alert(
		// 	"La sección de búsqueda aún no está programada, igual vas a poder verla!"
		// );
		alertRef.current = true;
	}

	return (
		<>
			<h5 className="mt-3">Results</h5>
			<div className={styles.results}>
				<div className={`${styles.result} ${styles.resultHeader}`}>
					<div className="text-center">VC</div>
					<div className="text-center">Canal</div>
					<div className="text-center">Logo</div>
					<div className="text-center">SID</div>
					<div className="text-center">
						{filter ? getTitle(filter) : "No hay filtro"}
					</div>
				</div>
				{results.length === 0 || !results ? (
					<span>No results...</span>
				) : (
					<div style={{ overflowX: "hidden", overflowY: "scroll" }}>
						{results.map((result) => (
							<div
								className={styles.result}
								key={result.id}
								onClick={() => handleResultClick(result)}
							>
								<div>{result.data.vc}</div>
								<div>{result.data.canal}</div>
								<div className={styles.imgContainer}>
									<img src={result.data.img} alt={result.data.title} />
								</div>
								<div>{result.data.sid}</div>
								<div>{result.data[filter]}</div>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
}
