import React, { useContext, useRef } from "react";
import styles from "../FilterForm.module.css";
import { FilterContext } from "./Dashboard";

export default function FilterForm({
	setSelectedChannel,
	setSearching,
	contentRef,
}) {
	const { results, filter } = useContext(FilterContext);

	const handleResultClick = (result) => {
		contentRef.current.style.opacity = 0;
		setTimeout(() => {
			setSelectedChannel(result);
			setSearching(false);
			contentRef.current.style.opacity = 100;
		}, 200);
	};

	const getTitle = (col) => {
		const cols = JSON.parse(localStorage.getItem("columns")) || [];
		const found = cols.find((column) => column.data.column === col);
		return found ? found.data.title : "";
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
						{filter
							? getTitle(filter)
							: results.length > 0
							? "Matches"
							: "No hay filtro"}
					</div>
				</div>
				{results?.length === 0 || !results ? (
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
								<div>
									{filter
										? result.data[filter]
										: result.data.matchedAt
										? result.data.matchedAt.map((match, i) => {
												if (i === 0 && result.data.matchedAt.length > 1)
													return `${getTitle(match)}: ${result.data[match]} - `;
												if (i !== result.data.matchedAt.length - 1)
													return `${getTitle(match)}: ${result.data[match]} - `;
												if (i === result.data.matchedAt.length - 1)
													return `${getTitle(match)}: ${result.data[match]}`;
												return match;
										  })
										: null}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
}
