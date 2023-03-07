import React, { useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModal = ({
	show,
	setShow,
	property,
	selectedChannel,
	setEditPayload,
	setEditCache,
	editCache,
	editPayload,
}) => {
	// debugging
	// useEffect(() => {
	// 	console.log(editPayload);
	// }, [editPayload]);
	// debugging

	const newValRef = useRef();
	const submitRef = useRef();
	const handleClose = () => setShow(false);
	const handleClick = () => {
		if (newValRef.current.value === selectedChannel.data[property.property]) {
			handleClose();
			return; // return if the value has not changed
		}
		const isInCache = editCache.find((e) => e.id === selectedChannel.id);
		if (!isInCache) {
			// if the channel has not been cached we cache to possibly revert changes
			setEditCache((prev) => [
				...prev,
				{ id: selectedChannel.id, data: selectedChannel.data },
			]);
		}

		const hasPendingEdits =
			editPayload.findIndex((e) => e.id === selectedChannel.id) > -1; // index of the pending edits
		if (hasPendingEdits) {
			const pendingEditsIndex = editPayload.findIndex(
				(e) => e.id === selectedChannel.id
			);
			const newPayload = [...editPayload];
			newPayload[pendingEditsIndex].changes = {
				...editPayload[pendingEditsIndex].changes,
				[property.property]: newValRef.current.value,
				prevState: {
					...newPayload[pendingEditsIndex].changes.prevState,
					[property.property]: selectedChannel.data[property.property],
				},
			};

			setEditPayload(newPayload);
		} else {
			setEditPayload((prev) => [
				...prev,
				{
					id: selectedChannel.id,
					changes: {
						[property.property]: newValRef.current.value,
						prevState: {
							[property.property]: selectedChannel.data[property.property],
						},
					},
				},
			]);
		}
		handleClose();
	};
	const handleKey = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			submitRef.current.click();
		}
	};
	return (
		<>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={true}
				style={{ color: "black", caretColor: "transparent" }}
			>
				<Modal.Header closeButton>
					<Modal.Title>
						Elige un nuevo valor para {property.stringToShow}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group className="mb-3" style={{ caretColor: "auto" }}>
						<Form.Label>Nuevo valor:</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							defaultValue={selectedChannel?.data[property.property]}
							ref={newValRef}
							onKeyDown={handleKey}
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<div
						style={{
							display: "flex",
							gap: "30px",
						}}
					>
						<Button variant="secondary" onClick={handleClose}>
							Cancelar
						</Button>
						<Button variant="primary" onClick={handleClick} ref={submitRef}>
							Aceptar
						</Button>
					</div>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default EditModal;
