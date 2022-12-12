import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import useGrant from "../hooks/useGrant";
import Loader from "./Loader";
import { Link } from "react-router-dom";

export default function Login() {
	useGrant();
	const emailRef = useRef();
	const passwordRef = useRef();
	const { login } = useAuth();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			await login(
				`${emailRef.current.value}@dtvpan.com`,
				passwordRef.current.value
			);
		} catch (err) {
			setError(
				`Failed to sign in: ${err.code
					.match(/\/(.+)/)[1]
					.replace(new RegExp(/-/, "g"), " ")}`
			);
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
					<h2 className="text-center mb-4">Log In</h2>
					{error ? <Alert variant="danger">{error}</Alert> : null}
					<Form onSubmit={handleSubmit}>
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
						<Form.Group id="password">
							<Form.Label className="mt-3">Password</Form.Label>
							<Form.Control
								type="password"
								ref={passwordRef}
								required
								style={{ caretColor: "auto" }}
							></Form.Control>
						</Form.Group>
						<Button disabled={loading} type="submit" className="w-100 mt-4">
							Log In
						</Button>
					</Form>
					<div className="w-100 text-center mt-3">
						Forgot your password?{" "}
						<div>
							<Link to="/recover">Change it</Link>
						</div>
					</div>
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
