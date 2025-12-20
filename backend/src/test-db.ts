import pool from './db';

async function main() {
	try {
		const res = await pool.query('SELECT NOW()');
		console.log('Connected successfully', res.rows[0]);
	} catch (e) {
		console.error('Connection failed', e);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

main();
