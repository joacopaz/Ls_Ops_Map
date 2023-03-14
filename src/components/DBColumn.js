import React from "react";
import { ListGroup } from "react-bootstrap";
import styles from "../Mapa.module.css";

export default function DBColumn({ column, selected, setSelected }) {
	return (
		<ListGroup.Item
			as="li"
			active={selected}
			className={`${styles.user}`}
			style={{
				display: "flex",
				justifyContent: "space-between",
				width: "200px",
			}}
			onClick={() => {
				setTimeout(
					() =>
						document
							.querySelector("#col-data")
							.scrollIntoView({ behavior: "smooth" }),
					50
				);

				if (selected) return setSelected(undefined);
				setSelected(column);
			}}
		>
			{
				<>
					<span>{column.title}</span>
					<span>{column.order}</span>
				</>
			}
		</ListGroup.Item>
	);
}
