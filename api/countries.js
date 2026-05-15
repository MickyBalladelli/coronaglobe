// Vercel Serverless Function for countries API endpoint
const axios = require('axios');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    console.log("Fetching countries data from https://hantavirus.one/data/countries.json...");
    const response = await axios.get('https://hantavirus.one/data/countries.json', {
      timeout: 10000 // 10 second timeout
    });
    const data = response.data;
    console.log("Fetched countries data:", data.length, "countries");
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching countries data:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      error: 'Failed to fetch countries data',
      message: error.message
    });
  }
}

// Optional: Set the API route to be a GET request
module.exports.config = {
  api: {
    externalResolver: true,
  },
}
