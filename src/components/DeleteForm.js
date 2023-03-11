import React, { forwardRef, useEffect } from "react";
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
			setEdit,
			cancelEditingMode,
		},
		ref
	) => {
		useEffect(() => {
			ref.current.focus();
			setEdit(false);
			setEditPayload([]);
		}, []);
		return (
			<Form className={styles.deleteForm}>
				<h3 className="mb-5 text-center">Delete existing channel</h3>
				{!deleteConfirm ? (
					<Form.Control
						type="text"
						className={`w-100 d-block text-center mb-5 ${styles.search}`}
						placeholder={"Search channel to delete"}
						list="datalist"
						onChange={handleDeleteInput}
						ref={ref}
					/>
				) : null}
				{deleteConfirm ? (
					<Alert variant="danger" className="mt-3 text-center ">
						<Alert.Heading>Warning</Alert.Heading>
						You're about to delete all the information for{" "}
						{`${channelToDelete.data.vc} ${channelToDelete.data.canal}`}. Only
						an Admin can undo this, are you absolutely sure?
					</Alert>
				) : null}
				{/* Buttons */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-evenly",
						marginTop: "2rem",
					}}
				>
					<Button
						variant="danger"
						onClick={(e) => {
							if (!deleteConfirm) {
								setEditPayload((prev) => [
									...prev,
									{
										id: channelToDelete.id,
										changes: {
											actionType: "Delete",
											prevState: { ...channelToDelete.data },
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
					<Button
						onClick={() => {
							setDeleteConfirm(false);
							cancelEditingMode();
						}}
					>
						Cancel
					</Button>
				</div>
			</Form>
		);
	}
);

export default DeleteForm;
