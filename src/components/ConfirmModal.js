import React from "react";
import { Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../contexts/AuthContext";
import styles from "../Mapa.module.css";
const ConfirmModal = ({
	showConfirm,
	setShowConfirm,
	handleConfirm,
	alert,
}) => {
	const handleClose = () => setShowConfirm(null);
	const { currentUser } = useAuth();

	return (
		<>
			<Modal
				show={showConfirm?.show}
				onHide={handleClose}
				style={{ color: "black" }}
			>
				<Alert variant="danger" className="w-100 text-center">
					{alert
						? alert
						: `The following changes will be logged for ${currentUser.username}`}
				</Alert>
				{!alert ? (
					<Modal.Body
						dangerouslySetInnerHTML={{ __html: showConfirm?.value }}
						className={styles.confirmModalBody}
					></Modal.Body>
				) : null}
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={() => {
							handleConfirm(false);
						}}
						disabled={alert}
					>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ConfirmModal;
