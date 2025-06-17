const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('Redis Client Connection Error:', err);
  }
})();

module.exports = client;
