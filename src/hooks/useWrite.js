import { db } from "../firebase-config";
import {
	doc,
	setDoc,
	deleteDoc,
	updateDoc,
	deleteField,
} from "firebase/firestore";

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

const delField = async (collectionName, path, field) => {
	try {
		const ref = doc(db, collectionName, path);
		await updateDoc(ref, {
			[field]: deleteField(),
		});
	} catch (error) {
		console.log(error);
	}
};

const useWrite = () => {
	return { write, del, delField };
};

export default useWrite;
