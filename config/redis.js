// Connect to Redis
const { createClient } = require('redis');

// Create Redis client
const redisClient = createClient();

// Handle Redis client errors
redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

// Function to connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();  // Connect to Redis
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis', err);
  }
};

// Export both the client and the connect function
module.exports = {
  redisClient,
  connectRedis
};
