import React, { forwardRef, useEffect, useRef } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import styles from "../Mapa.module.css";

const DeleteForm = forwardRef(
	(
		{
			handleDeleteInput,
			deleteConfirm,
			setDeleteConfirm,
			channelToDelete,
			handleWillDelete,
			setEditPayload,
		},
		ref
	) => {
		const deleteRef = useRef();
		useEffect(() => {
			deleteRef.current.focus();
		});
		return (
			<Form className={styles.deleteForm}>
				<Form.Control
					type="text"
					className={`w-100 d-block text-center mt-3 ${styles.search}`}
					placeholder={"Search channel to delete"}
					list="datalist"
					onChange={handleDeleteInput}
					ref={deleteRef}
				/>
				{deleteConfirm ? (
					<Alert variant="danger" className="mt-3 text-center ">
						<Alert.Heading>Warning</Alert.Heading>
						You're about to delete all the information for{" "}
						{`${channelToDelete.data.vc} ${channelToDelete.data.canal}`}. Only
						an Admin can undo this, are you absolutely sure?
					</Alert>
				) : null}
				<Button
					variant="danger"
					className="d-block m-auto mt-3"
					onClick={(e) => {
						if (!deleteConfirm) {
							setEditPayload((prev) => [
								...prev,
								{
									id: channelToDelete.id,
									changes: {
										type: "Delete",
									},
								},
							]);
							console.log("Payload set for deletion");
							return setDeleteConfirm(true);
						}
						if (window.confirm("Absolutely sure?")) {
							handleWillDelete(true);
							setDeleteConfirm(false);
							return;
						}
						console.log("Payload unset for deletion");
						setDeleteConfirm(false);
						setEditPayload([]);
					}}
				>
					{deleteConfirm ? "Delete All Information" : "Delete"}
				</Button>
			</Form>
		);
	}
);

export default DeleteForm;
