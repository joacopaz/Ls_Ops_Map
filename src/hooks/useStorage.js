/**
 * @param {function} methods Can be set returns undefined, get returns key value pair, getAll  returns object with all or clear (use with caution)
 */
const storage = {
	/**
	 * @param {string} key A string for the key to set
	 * @param {string} value A string for the value to set
	 */
	set(key, value) {
		localStorage.setItem(key, value);
		return;
	},
	/**
	 * @param {string} key A string for the key to get, returns the value
	 */
	get(key) {
		const value = localStorage.getItem(key);
		return value;
	},
	/**
	 * @param null No params
	 */
	getAll() {
		const all = {};
		for (const key in localStorage) {
			if (Object.hasOwnProperty.call(localStorage, key)) {
				const element = localStorage[key];
				all[key] = element;
			}
		}
		return all;
	},
	/**
	 * @param null No params
	 */
	clear() {
		localStorage.clear();
		return;
	},
};

export default storage;
