import { createBrowserRouter } from "react-router-dom";
import Signup from "../components/Signup";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import Recover from "../components/Recover";

export const router = createBrowserRouter([
	{
		path: "/signup",
		element: <Signup />,
	},
	{
		path: "/",
		element: <Dashboard />,
	},
	{
		path: "*",
		element: <Dashboard />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/recover",
		element: <Recover />,
	},
]);
