import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import styles from "../Mapa.module.css";

export default function ChannelDataColumn({
	title,
	column,
	edit,
	editData,
	isLong,
	colString,
	defaultView,
}) {
	useEffect(() => {
		// console.log(column);
	});
	return (
		<>
			{(defaultView &&
				column !== "-" &&
				column !== undefined &&
				column !== "") ||
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
