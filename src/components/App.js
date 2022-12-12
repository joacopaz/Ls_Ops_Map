import React from "react";
import { Container } from "react-bootstrap";
import AuthProvider from "../contexts/AuthContext";
import { router } from "../contexts/Router";
import { RouterProvider } from "react-router-dom";
import "../App.css";

function App() {
	return (
		<Container
			className="d-flex align-items-center justify-content-center"
			style={{ minHeight: "100vh" }}
		>
			<div className="w-100 d-flex align-items-center justify-content-center">
				<AuthProvider>
					<RouterProvider router={router}></RouterProvider>
				</AuthProvider>
			</div>
		</Container>
	);
}

export default App;
