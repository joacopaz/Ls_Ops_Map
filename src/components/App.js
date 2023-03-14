import React from "react";
import AuthProvider from "../contexts/AuthContext";
import { router } from "../contexts/Router";
import { RouterProvider } from "react-router-dom";
import "../App.css";

function App() {
	return (
		<div className="appContainer">
			<div className="w-100 d-flex align-items-center justify-content-center">
				<AuthProvider>
					<RouterProvider router={router}></RouterProvider>
				</AuthProvider>
			</div>
		</div>
	);
}

export default App;
