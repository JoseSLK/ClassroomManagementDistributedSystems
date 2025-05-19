import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'dtic_admin',
    password: process.env.DB_PASSWORD || 'dtic_secret_password',
    database: process.env.DB_NAME || 'prestamos_aulas_dtic'
});

export default pool;
