import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

export default function Recover() {
	const emailRef = useRef();
	const { recover } = useAuth();
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			await recover(`${emailRef.current.value}@dtvpan.com`);
			setSuccess(true);
		} catch (err) {
			setSuccess(true);
		}
		setLoading(false);
	}
	function handleChange(e) {
		if (e.nativeEvent.data && !e.nativeEvent.data.match(/^[a-zA-Z0-9]*$/))
			emailRef.current.value = emailRef.current.value.substring(
				0,
				emailRef.current.value.length - 1
			);
	}

	return (
		<>
			{loading ? <Loader /> : null}
			<Card
				style={{
					position: "relative",
					bottom: "80px",
					color: "black",
					caretColor: "transparent",
				}}
			>
				<Card.Body>
					<h2 className="text-center mb-4">Password Reset</h2>
					{error ? <Alert variant="danger">{error}</Alert> : null}
					{success ? (
						<Alert variant="info" className="text-center">
							An email has been sent to the user's email. Please check your Spam
							folder if you can't find it.
						</Alert>
					) : null}
					<Form onSubmit={handleSubmit}>
						{!success ? (
							<Form.Group id="email">
								<Form.Label>Username</Form.Label>
								<Form.Control
									type="text"
									ref={emailRef}
									required
									onChange={handleChange}
									style={{ caretColor: "auto" }}
								></Form.Control>
							</Form.Group>
						) : null}

						{success ? (
							<Button
								disabled={loading}
								className="w-100 mt-4"
								onClick={(e) => {
									navigate("/login");
								}}
							>
								Go to login
							</Button>
						) : (
							<Button disabled={loading} type="submit" className="w-100 mt-4">
								Send reset email
							</Button>
						)}
					</Form>
				</Card.Body>
			</Card>
			{/*
			REMOVED TO IMPROVE SECURITY, ONLY MANUALLY GENERATED ACCOUNTS ARE ALLOWED
			<div className="w-100 text-center mt-2">
				Need an account? <Link to="/signup">Sign Up</Link>
			</div> */}
		</>
	);
}
