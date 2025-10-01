const { Pool } = require("pg")
require("dotenv").config()

console.log('Database configuration loading...')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL)

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool

if (process.env.NODE_ENV == "development") {
  console.log('Using development database configuration with SSL')
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
} else {
  console.log('Using production database configuration')
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
}

// Connection event handlers
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message)
})

pool.on('remove', () => {
  console.log('Database connection closed')
})

// Test connection on startup
async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('✅ Database test successful. Current time:', result.rows[0].now)
    client.release()
  } catch (error) {
    console.error('❌ Database connection test failed:')
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Full error:', error)
  }
}

// Run connection test
testConnection()

// Added for troubleshooting queries during development
if (process.env.NODE_ENV == "development") {
  module.exports = {
    async query(text, params) {
      try {
        const start = Date.now()
        const res = await pool.query(text, params)
        const duration = Date.now() - start
        console.log("executed query", { text, duration, rows: res.rowCount })
        return res
      } catch (error) {
        console.error("error in query", { text })
        console.error("Query error details:", error.message)
        throw error
      }
    },
  }
} else {
  module.exports = pool
}