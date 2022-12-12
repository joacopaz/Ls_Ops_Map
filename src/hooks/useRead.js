import { db } from "../firebase-config";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

/**
 * @param {string} collectionName String of the collection to fetch (channels or history)
 *@param {string} path String doc to fetch inside that collection (collection history => current, collection channels => index of channel)
 */
const read = async (collectionName, path) => {
	try {
		const docRef = doc(db, collectionName, path);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data();
			return data;
		} else {
			// doc.data() will be undefined in this case
			console.log("No such document!");
			return null;
		}
	} catch (err) {
		console.log(err);
	}
};
/**
 * @param {string} collectionName String of the collection to fetch (channels or history)
 */
const readAll = async (collectionName) => {
	try {
		const collectionRef = collection(db, collectionName);
		const querySnapshot = await getDocs(collectionRef);
		const response = [];
		querySnapshot.forEach((doc) => {
			response.push({ id: doc.id, data: doc.data() });
		});
		return response;
	} catch (err) {
		console.log(err);
	}
};

const useRead = () => {
	return { read, readAll };
};

export default useRead;
