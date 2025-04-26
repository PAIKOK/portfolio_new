const { Pool } = require('pg');

let pool;

// If DATABASE_URL is defined (Render/production), use it with SSL
if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    // Local development config
    pool = new Pool({
        user: process.env.PGUSER || 'postgres',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'portfolio',
        password: process.env.PGPASSWORD || 'postgres',
        port: process.env.PGPORT || 5432,
    });
}

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database:', err);
    } else {
        console.log('Connected to PostgreSQL database at:', res.rows[0].now);
    }
});

// Initialize contacts table
const initializeDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// Add a new contact message
const addContactMessage = async (name, email, message) => {
    const query = 'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id';
    const values = [name, email, message];
    try {
        const result = await pool.query(query, values);
        return { id: result.rows[0].id, success: true };
    } catch (error) {
        throw error;
    }
};

// Retrieve all contact messages
const getAllContactMessages = async () => {
    try {
        const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
        return result.rows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    pool,
    initializeDb,
    addContactMessage,
    getAllContactMessages
};
