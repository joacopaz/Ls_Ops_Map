import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

import styles from "../Mapa.module.css";

export default function MapButtons({
	selectedChannel,
	edit,
	deleting,
	setEdit,
	finishEditing,
	cancelEditingMode,
	handleChannelCreation,
	handleChannelDeletion,
}) {
	const [hovering, setHovering] = useState(false);

	return (
		<div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
			{selectedChannel && !edit && !deleting ? (
				<Button
					variant="primary"
					className="mt-4"
					onClick={() => setEdit(true)}
				>
					Edit
				</Button>
			) : null}

			{selectedChannel && !edit && !deleting ? (
				<ButtonGroup
					style={{ position: "absolute", right: "1rem" }}
					className="mt-4"
				>
					<Button
						className={styles.roundButtons}
						variant="success"
						onMouseEnter={() => setHovering("create")}
						onMouseLeave={() => setHovering(false)}
						onClick={() => {
							setHovering(false);
							handleChannelCreation();
						}}
					>
						{hovering === "create" ? "Create new channel" : "+"}
					</Button>
					<Button
						className={styles.roundButtons}
						variant="danger"
						onMouseEnter={() => setHovering("delete")}
						onMouseLeave={() => setHovering(false)}
						onClick={() => {
							setHovering(false);
							handleChannelDeletion();
						}}
					>
						{hovering === "delete" ? `Delete existing channel` : "-"}
					</Button>
				</ButtonGroup>
			) : null}

			{selectedChannel && edit ? (
				<Button variant="success" className="mt-4" onClick={finishEditing}>
					Submit Changes
				</Button>
			) : null}
			{selectedChannel && edit ? (
				<Button variant="danger" className="mt-4" onClick={cancelEditingMode}>
					Cancel
				</Button>
			) : null}
		</div>
	);
}

// handleChannelCreation,
// handleChannelDeletion,
