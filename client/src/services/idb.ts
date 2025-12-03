import { openDB } from 'idb';

const idb = await openDB('notes', 1, {
	upgrade(db) {
		db.createObjectStore('documents');
	},
});

export default idb;
