import React from "react";
import { ListGroup } from "react-bootstrap";
import styles from "../Mapa.module.css";

export default function User({ id, isAdmin, name, selected, setSelected }) {
	return (
		<ListGroup.Item
			as="li"
			onClick={() => {
				selected ? setSelected(null) : setSelected({ id, name, isAdmin });
			}}
			active={selected}
			className={styles.user}
		>
			{name}
		</ListGroup.Item>
	);
}
