// Vercel Serverless Function for hantavirus API endpoint
// This avoids CORS issues by fetching data server-side
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
    console.log("Fetching hantavirus data from https://hantavirus.one/data/countries.json...");
    const response = await axios.get('https://hantavirus.one/data/countries.json', {
      timeout: 10000 // 10 second timeout
    });
    const data = response.data;
    console.log("Fetched hantavirus data:", Array.isArray(data) ? data.length : 'unknown', "items");
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching hantavirus data:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      error: 'Failed to fetch hantavirus data',
      message: error.message
    });
  }
}
