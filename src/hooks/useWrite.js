import { db } from "../firebase-config";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

const write = async (collectionName, path, dataObj) => {
	try {
		await setDoc(doc(db, collectionName, path), dataObj, {
			merge: true,
		});
		// console.log(`Updated ${collectionName}[${path}]`);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
};

const del = async (collectionName, path) => {
	try {
		await deleteDoc(doc(db, collectionName, path));
	} catch (error) {
		console.log(error);
	}
};

const useWrite = () => {
	return { write, del };
};

export default useWrite;
