import { openDB } from 'idb';

const idb = await openDB('notes', 1, {
	upgrade(db) {
		db.createObjectStore('offline-notes');
	},
});

export default idb;
