import { db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";

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

const useWrite = () => {
	return write;
};

export default useWrite;
