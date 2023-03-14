import React from "react";
import { Button } from "react-bootstrap";
import styles from "../Mapa.module.css";

export default function ChannelDataColumn({
	title,
	column,
	edit,
	editData,
	colString,
	hidden,
}) {
	// useEffect(() => {
	// console.log(colString);
	// });
	return (
		<>
			{(!hidden && column !== "-" && column !== undefined && column !== "") ||
			edit ? (
				<li>
					<strong>{title}:</strong>
					{column}
					{edit ? (
						<Button
							variant="outline-danger"
							size="sm"
							className={styles.editBtn}
							onClick={(e) => editData(e.target.dataset.edit)}
							data-edit={colString}
						>
							Edit
						</Button>
					) : null}
				</li>
			) : null}
		</>
	);
}
