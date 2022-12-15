import { refEqual } from "firebase/firestore";
import React, { forwardRef } from "react";
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
		return (
			<Form className={styles.deleteForm}>
				<Form.Control
					type="text"
					className="w-100 d-block text-center"
					placeholder={"Search by VC or channel name"}
					list="datalist"
					ref={ref}
					onChange={handleDeleteInput}
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
							console.log("Payload set");
							return setDeleteConfirm(true);
						}
						if (window.confirm("Absolutely sure?")) {
							handleWillDelete(true);
							setDeleteConfirm(false);
						}
					}}
				>
					{deleteConfirm ? "Delete All Information" : "Delete"}
				</Button>
			</Form>
		);
	}
);

export default DeleteForm;
