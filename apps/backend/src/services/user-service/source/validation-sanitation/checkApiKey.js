require('dotenv').config();

function checkApiKey(req, res, next) {
  const apiKey = req.header('x-api-key'); //  Clients must send header: x-api-key: your-very-secret-api-key

  if (!apiKey || apiKey !== process.env.API_KEY) {  //  just checks to see if the API key matches the one in our .env file as of right now - will expand
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  next();
}

module.exports = checkApiKey;
