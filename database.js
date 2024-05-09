const oracledb = require('oracledb');

// Set up connection pool parameters
const poolConfig = {
  user: '(Username)',
  password: '(Password)',
  connectString: 'Connection String Here',
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 2,
};
// Create a connection pool
const poolPromise = (DBName).createPool(poolConfig)
  .then(pool => {
    console.log("Connection pool created successfully.");
    return pool;
  })
  .catch(error => {
    console.error('Error creating connection pool:', error);
    throw error;
  });

// Export the pool itself in case you need to access it directly
module.exports = { poolPromise };