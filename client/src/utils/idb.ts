import idb from '../services/idb';

export const getAllNotesFromIDB = async () => {
	const values = await idb.getAll('offline-notes');
	const keys = await idb.getAllKeys('offline-notes');
	return values.map((value, index) => ({ ...value, id: keys[index] }));
};
