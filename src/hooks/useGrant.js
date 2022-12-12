import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const useGrant = () => {
	const navigate = useNavigate();
	const { currentUser } = useAuth();

	useEffect(() => {
		if (currentUser) navigate("/");
		if (!currentUser) navigate("/login");
	}, [currentUser, navigate]);
};

export default useGrant;
